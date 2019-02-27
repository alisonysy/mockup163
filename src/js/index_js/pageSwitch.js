{
  let view = {
    el:'nav>ul>li'
  }
  let model = {}
  let controller={
    view:null,
    model:null,
    init(view,model){
      this.view = view;
      this.model = model;
      this.bindEvent()
    },
    bindEvent(){
      let v = $(this.view.el);
      console.log(v);
      $(this.view.el).on('click',function(e){
        let cur = $(e.currentTarget);
        console.log(cur);
        cur.addClass('active').siblings().removeClass('active');
        console.log('done')
      })
    }
  }
  controller.init(view,model);
}