<template>
  <div id="curtain">
    <el-card shadow="hover">
      <div id="shopsCon">
        <p class="f12 tl" style="color: red;">（带*号表示可选择帘头外包盒）</p>
        <div id="shopSearchBox" class="mt10">
          <el-input
            clearable
            v-model.trim="searchKey"
            @clear="getData(1)"
            @keyup.enter.native="getDataBlur(1)"
            placeholder="输入商品型号查找商品"
            style="width:25%; min-width:250px;"
          >
            <div
              id="searchBtn"
              slot="append"
              style="cursor:pointer;"
              @click="getDataBlur(1)"
            >
              搜索
            </div>
          </el-input>
        </div>
        <el-table
          class="loading-area"
          :data="curtainMsg"
          style="min-width: 750px; margin: 5px auto;"
        >
          <el-table-column label="型号" width="120" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.wbhFlag === '1'">
                {{ scope.row.itemNo }}
                <span style="color: red;">*</span>
              </div>
              <div v-else>
                {{ scope.row.itemNo }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="宽度(m)" width="80" align="center">
            <template slot-scope="scope">
              <currency-input
                :customStyle="'width: 60px;'"
                placeholder="0.00"
                v-model="scope.row.width"
              >
              </currency-input>
            </template>
          </el-table-column>
          <el-table-column label="高度(m)" width="80" align="center">
            <template slot-scope="scope">
              <currency-input
                :customStyle="'width: 60px;'"
                placeholder="0.00"
                v-model="scope.row.height"
              >
              </currency-input>
            </template>
          </el-table-column>
          <el-table-column label="帘外包宽度(m)" prop="fixGrade" width="120" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.wbhFlag === '1'">
                <el-checkbox v-model="scope.row.isWBH">
                  <currency-input
                    :customStyle="'width: 60px;'"
                    placeholder="0.00"
                    v-model="scope.row.WBH"
                  >
                  </currency-input>
                </el-checkbox>
              </div>
              <div v-else>
                <el-checkbox v-model="scope.row.isWBH" disabled>
                  <el-input
                    style="width:60px;"
                    size="mini"
                    placeholder="无"
                    v-model="scope.row.WBH"
                    disabled
                  >
                  </el-input>
                </el-checkbox>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="褶皱倍数" width="100" align="center">
            <template slot-scope="scope">
              <el-select
                size="mini"
                v-model="scope.row.multiple"
                style="width:70px;"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="位置" width="140" align="center">
            <template slot-scope="scope">
              <el-input
                style="width:120px;"
                size="mini"
                ref="location"
                placeholder="选填(20字符内)"
                v-model="scope.row.location"
                @input="oninput($event,scope.$index)"
              >
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="活动" width="280" align="center">
            <template slot-scope="scope">
              <el-select
                style="width:250px"
                size="mini"
                :disabled="isActivity[scope.$index]"
                v-model="scope.row.activityId"
                :placeholder="
                  isActivity[scope.$index] === true
                    ? '无可选活动'
                    : '请选择活动'
                "
              >
                <el-option
                  v-for="item in activityOptions[scope.$index]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <a @click="chooseItem(scope.row, scope.$index)" style="color:red;"
                >选择此款</a
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin:0 20%;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="totalNumber"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapMutations, mapActions } from "vuex";
import { mapState } from "vuex";
import Cookies from "js-cookie";
import { getCurtainMsg, getShopSingleCurtain } from "@/api/shopSearch";
import { findItemActivity } from "@/api/findActivity";
import { getItemById, GetPromotionByItem } from "@/api/orderListASP";

export default {
  name: "Curtain",
  data() {
    return {
      cid: Cookies.get("cid"), //假定的用户ID
      customerType: Cookies.get("customerType"), //客户类型
      searchKey: "", //搜索的关键词
      //窗帘数据
      curtainData: [],
      //产品对应的数据：宽、高、假帘高、褶皱倍数、位置、活动
      curtainMsg: [],
      //褶皱倍数选项
      options: [
        { value: "1.8" },
        { value: "1.9" },
        { value: "2.0" },
        { value: "2.1" },
        { value: "2.2" },
        { value: "2.3" },
        { value: "2.4" },
        { value: "2.5" },
        { value: "2.6" },
        { value: "2.7" },
        { value: "2.8" },
        { value: "2.9" },
        { value: "3.0" }
      ],
      activityOptions: [], //活动的数组
      isActivity: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ], //是否有活动
      activityGroup: [], //活动ID对应的groupType
      currentPage: 1, //当前的页数
      pageSize: 10, //每页的个数
      totalNumber: 0 //总条数
    };
  },
  filters: {
    calLength(str) {
      var len = 0;
      for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        //单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
          len++;
        } else {
          len += 2;
        }
      }
      return len;
    }
  },
  methods: {
    oninput(e,index) {
      e = this.splitStr(e,20)
      this.curtainMsg[index].location = e;
    },
    splitStr(str,length){
       var len = 0;
       var returnStr = '';
       for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        //单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
          len++;
        } else {
          len += 2;
        }
        if(len <= length) returnStr += String.fromCharCode(c);
      }
      return returnStr;
    },
    //进入窗帘详情
    chooseItem(data, index) {
      let arr = [];
      let str = "";
      if (data.width === "") {
        arr.push("宽度");
      }
      if (data.height === "") {
        arr.push("高度");
      }
      if (data.multiple === "") {
        arr.push("褶皱倍数");
      }
      if (arr.length !== 0) {
        str = arr.join("、");
        this.$alert(`请确保产品${data.itemNo}的${str}已经输入!!`, "提示", {
          confirmButtonText: "好的"
        });
        return;
      }
      if (data.activityId === "") {
        if (this.isActivity[index] === false) {
          this.$alert("请选择活动!!", "提示", {
            confirmButtonText: "好的"
          });
          return;
        } else data.activityId = null;
      }
      if (data.wbhFlag === "1" && data.isWBH === false && data.WBH !== "") {
        this.$alert("在填写了帘外包宽度的情况下，请勾选前面的按钮!!", "提示", {
          confirmButtonText: "好的"
        });
        return;
      }
      if (data.wbhFlag === "1" && data.isWBH === true && data.WBH === "") {
        this.$alert("在勾选了帘外包的情况下，帘外包宽度不能为空!!", "提示", {
          confirmButtonText: "好的"
        });
        return;
      }
      let _groupType;
      this.activityGroup.forEach(item => {
        if (item.pId === data.activityId) {
          _groupType = item.groupType;
        }
      });
      this.curtainMsg[index].groupType = _groupType;
      let activeName = "";
      this.activityOptions[index].forEach(item => {
        if (item.value === data.activityId) {
          activeName = item.label;
        }
      });
      this.curtainMsg[index].activeName = activeName;
      Cookies.set("curtainMsg", data);
      this.addTab("shops/shoppingCurtainDetail");
      this.$router.push({
        name: `shoppingCurtainDetail`
      });
    },
    ...mapMutations("navTabs", ["addTab"]),
    ...mapActions("navTabs", ["closeTab"]),
    //清空信息
    clearMsg() {
      this.curtainData = [];
      this.curtainMsg = [];
      this.currentPage = 1;
      this.totalNumber = 0;
    },
    //获取每页的条数
    handleSizeChange(val) {},
    //当前页改变时的操作
    handleCurrentChange(val) {
      if (this.searchKey === "") {
        this.getData(0);
      } else {
        this.getDataBlur(0);
      }
    },
    //获取窗帘数据--默认搜索
    getData(status) {
      if (this.searchKey !== "") return;
      //0为默认搜索，1为搜索时首页
      if (status === 1) this.currentPage = 1;
      let data = {
        limit: this.pageSize,
        page: this.currentPage
      };
      getCurtainMsg(data)
        .then(res => {
          //赋值给表格
          this.curtainData = res.data;
          this.curtainData = this.curtainData.filter(
            item => item.saleId != "C" && item.saleId != "F"
          );
          this.createCurtainMsg(this.curtainData);
          //获取总条数
          if (this.totalNumber !== this.curtainData[0].total) {
            this.totalNumber = this.curtainData[0].total;
          }
        })
        .catch(err => {
          //获取失败，清空数据
          this.clearMsg();
          this.searchKey = "";
        });
    },
    //获取窗帘数据--模糊搜索
    getDataBlur(status) {
      //0为默认模糊搜索，1为模糊搜索时首页
      if (this.searchKey === "") return;
      if (status === 1) this.currentPage = 1;
      let data = {
        itemNo: this.searchKey.toUpperCase(),
        limit: this.pageSize,
        page: this.currentPage
      };
      getShopSingleCurtain(data)
        .then(res => {
          //赋值给表格
          this.curtainData = res.data;
          this.curtainData = this.curtainData.filter(
            item => item.saleId != "C" && item.saleId != "F"
          );
          this.createCurtainMsg(this.curtainData);
          if (this.totalNumber !== this.curtainData[0].total) {
            this.totalNumber = this.curtainData[0].total;
          }
        })
        .catch(err => {
          //获取失败，清空数据
          this.clearMsg();
        });
    },
    //渲染到表格的数
    async createCurtainMsg(data) {
      this.curtainMsg = [];
      this.activityOptions = [];
      this.isActivity = [];
      for (let i = 0; i < data.length; i++) {
        var defaultSel = {
          pri: 0,
          id: 0
        };
        this.curtainMsg.push({
          itemNo: data[i].itemNo, //型号
          width: "", //宽
          height: "", //高
          WBH: "", //假帘高
          isWBH: false, //false:不选假帘高，true：选择假帘高
          wbhFlag: data[i].wbhFlag, //1：需要假帘高，0：不需要假帘高
          multiple: "2.2", //褶皱倍数
          location: "", //位置
          activityId: "", //活动
          groupType: "", //groupType
          activeName: ""
        });
        let itemRes = await getItemById(
          { itemNo: data[i].itemNo },
          { loading: false }
        );
        let res = await GetPromotionByItem(
          {
            cid: this.cid,
            customerType: this.customerType,
            itemNo: itemRes.data.ITEM_NO,
            itemVersion: itemRes.data.ITEM_VERSION,
            productType: itemRes.data.PRODUCT_TYPE,
            productBrand: itemRes.data.PRODUCT_BRAND
          },
          { loading: false }
        );
        //没有活动下拉框disable
        if (res.data.length === 0) this.isActivity.push(true);
        else this.isActivity.push(false);
        let _obj = [];

        for (var j = 0; j < res.data.length; j++) {
          var obj = {
            label: res.data[j].ORDER_TYPE + " -- " + res.data[j].ORDER_NAME,
            value: res.data[j].P_ID
          };
          var obj1 = {
            pId: res.data[j].P_ID,
            groupType: res.data[j].GROUP_TYPE
          };
          if (res.data[j].PRIORITY != 0 && defaultSel.pri == 0) {
            defaultSel.pri = res.data[j].PRIORITY;
            defaultSel.id = res.data[j].P_ID;
          } else if (
            res.data[j].PRIORITY != 0 &&
            defaultSel.pri > res.data[j].PRIORITY
          ) {
            defaultSel.pri = res.data[j].PRIORITY;
            defaultSel.id = res.data[j].P_ID;
          }
          let re = this.activityGroup.some(i => i.pId === obj1.pId);
          if (re === false) this.activityGroup.push(obj1);
          _obj.push(obj);
        }
        _obj.push({
          label: "不参与活动",
          value: null
        });
        this.activityOptions.push(_obj);

        if (defaultSel.pri != 0) {
          this.curtainMsg[i].activityId = defaultSel.id;
        }
      }
    },
    //初始化
    init() {
      if (this.searchKey === "") {
        this.getData(1);
      } else {
        this.currentPage = 1;
        this.getDataBlur(0);
      }
    }
  },
  created() {
    this.init();
  },
  activated() {
    var selectNo = this.$route.params.selectNo;
    if (selectNo) {
      this.searchKey = selectNo;
      this.init();
    }
  }
};
</script>

<style>
#searchBox .el-input__inner {
  height: 34px;
  border-radius: 0px;
  outline: none;
}
#searchBox .el-form-item {
  display: block;
}
</style>

<style scoped>
a:hover {
  cursor: pointer;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
#searchBox {
  width: 47%;
  display: inline-block;
}
#searchBtn {
  color: #101010;
  cursor: pointer;
}
</style>

