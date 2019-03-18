{
  let view = {
    search:'#searchBar',
    form:'#search'
  };
  let model = {};
  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.bindEvent();
      window.eventHub.on('search',(searchVal)=>{
        console.log(searchVal);
      })
    },
    bindEvent(){
      this.getSearchVal();
      $(this.view.form).submit((e)=>{
        e.preventDefault();
        let form = e.currentTarget;
        let bar = $(form).find('input')[0];
        window.eventHub.emit('search',bar.value);
      });
    },
    getSearchVal(){
      const debounce = (func,delay)=>{
        let inDebounce;
        return function(){
          const ctx = this;
          const args = arguments;
          clearTimeout(inDebounce);
          inDebounce = setTimeout(() => {
            func.apply(ctx,args)
          }, delay);
        }
      };
      $(this.view.search).on('keydown',
        debounce(()=>{
          $(this.view.form).submit();
        },750))
    }
  };
  controller.init(view,model);
}