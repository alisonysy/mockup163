{
  let view = {
    el:'nav>ul>li',
    page:'[data-p]'
  }
  let model = {}
  let controller={
    view:null,
    model:null,
    init(view,model){
      this.view = view;
      this.model = model;
      this.bindEvent();
      window.eventHub.on('selectPage',(data)=>{
        let curPage = data[0].dataset.page;
        let pageList = $(this.view.page);
        for(var element of pageList){
          if($(element).hasClass(curPage)){
            $(element).addClass('displayed').siblings().removeClass('displayed')
            console.log('page switched')
          }
        }
      })
    },
    bindEvent(){
      $(this.view.el).on('click',function(e){
        let cur = $(e.currentTarget);
        cur.addClass('active').siblings().removeClass('active');
        window.eventHub.emit('selectPage',cur);
      })
    }
  }
  controller.init(view,model);
}