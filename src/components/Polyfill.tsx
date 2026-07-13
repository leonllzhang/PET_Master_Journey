const CODE = `(function(){
  // Promise.withResolvers — Safari < 18
  if(!Promise.withResolvers){
    Promise.withResolvers=function(){
      var a,b;
      var p=new Promise(function(r,j){a=r;b=j;});
      return {promise:p,resolve:a,reject:b};
    };
  }
})();`;

export default function Polyfill() {
  // Injected via next/script in layout — this component keeps the code in one place
  return null;
}

export { CODE };

