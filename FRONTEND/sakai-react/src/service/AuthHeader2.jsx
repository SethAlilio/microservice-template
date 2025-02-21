const loggedIn = document.cookie.replace(/(?:(?:^|.*;\s*)logged_in\s*\=\s*([^;]*).*$)|^.*$/, '$1');
const csrfToken = document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, '$1');
export default function authHeader() {

 const user = JSON.parse(localStorage.getItem('user'));
   // const user = useSelector(AuthUser);
   // console.log("From auth header" + user);

   // if (user && user.id) {
    if(loggedIn){
        //AuthService.setupAxiosInterceptors("Bearer "+user.id);
      // return { Authorization: AuthService.setupAxiosInterceptors(user.id) }
        return {'X-XSRF-TOKEN': csrfToken, 
            Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem('auth')).state.token,
            "Access-Control-Allow-Origin": "*",
            // headers: {"Access-Control-Allow-Origin": "*"},
        };
    } else {
        return {};
    }
}
