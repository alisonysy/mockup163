{
  let view ={
    el:'.playlist'
  };
  let model={};
  let controller={
    init(view,model){
      this.view = view;
      this.model = model;
      this.bindEvent();
      
    },
    bindEvent(){
      let li = $(this.view.el).find('li');
      console.log(li);
    }
  };
  controller.init(view,model);
}