const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const path = "rena";

let productModal = null;
let delProductModal = null;


const app = {
  data(){
    return{
      products:[],
      isNew : true,  //因為新增跟編輯用同個 modal, 所以要判斷是哪個動作(新增/編輯) 決定是否帶資料進去
      tempProduct :{  
        // Modal 的內的產品資訊
        // 新增: 預設為空
        // 編輯: 帶入該產品內容
        imagesUrl: [],
      }
    }
  },
  methods: {
      checkAdmin(){
          axios.post(`${apiUrl}/api/user/check`)
          .then(res=>{
              this.getProduct();
          }).catch(err=>{
              alert(err.response.data.message);
              window.location = 'login.html';
          })
      },
      getProduct(){
        axios.get(`${apiUrl}/api/${path}/admin/products`)
            .then(res=>{
                this.products = res.data.products;
            }).catch(err=>{
                alert(err.data.message);
            })
      },
      openModal(type,product){
        if(type==="new"){
          this.isNew = true;
          this.tempProduct = {
            imagesUrl: [],
          };
          productModal.show();
          
        }else if(type==="del"){
          this.tempProduct = {...product};
          delProductModal.show();
          
        }else if(type==="edit"){
          this.isNew = false;
          this.tempProduct = {...product};
          productModal.show();
        } 
      
      },
      newOrEditProduct(){
        //console.log(this.tempProduct);
        if(this.isNew){
          axios.post(`${apiUrl}/api/${path}/admin/product`,{
            data:this.tempProduct
          }).then(res=>{
            alert(res.data.message);
            productModal.hide();
            this.getProduct();
          }).catch(err=>{
            alert(err.response.data.message);
          })
        }else{
          axios.put(`${apiUrl}/api/${path}/admin/product/${this.tempProduct.id}`,{
            data:this.tempProduct
          }).then(res=>{
            alert(res.data.message);
            productModal.hide();
          }).catch(err=>{
            alert(err.response.data.message);
          })
        }
      },
      deleteProduct(){
        axios.delete(`${apiUrl}/api/${path}/admin/product/${this.tempProduct.id}`).then(res=>{
          alert(res.data.message);
          delProductModal.hide();
          this.getProduct();
        }).catch(err=>{
          alert(err.response.data.message);
        })
      },
      createImgs(){ 
        //只有一張主圖時，不會有 imagesUrl，要新增一組空的，才能往下新增其他照片
        this.tempProduct.imagesUrl = [];
        this.tempProduct.imagesUrl.push('');
      }
  },
  mounted() {
     //取得token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)userToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;
    this.checkAdmin();
    //btn 新增產品
    productModal = new bootstrap.Modal(document.getElementById("productModal"));
    //btn 刪除產品
    delProductModal = new bootstrap.Modal(document.getElementById("delProductModal"));
  },

}

Vue.createApp(app).mount("#app");