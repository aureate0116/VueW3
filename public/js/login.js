const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const path = "rena";

const app = {
    data(){
        return {
            user:{
                "username":"",
                "password":""
            }
        }
    },
    methods:{
        login(){
            
            axios.post(`${apiUrl}/admin/signin`, this.user)
            .then(res=>{
                //紀錄 token
                const { token, expired } = res.data;

                //紀錄 cookie
                document.cookie = `userToken=${token};expires=${new Date(expired)}; path=/`;
                window.location = 'products.html';

            }).catch(err=>{
                alert(err.data.message);
            })
        },
    }
}
Vue.createApp(app).mount('#app');