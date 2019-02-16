{
  let view={
    el:'.addSong',
    template:`
    Add New Song
    `,
    render(data){
      $(this.el).html(this.template);
    }
  }
  let model={}
  let controller={
    view:null,
    model:null,
    init(view,model){
      this.view = view;
      this.model = model;
      this.view.render();
      this.activate();
      window.eventHub.on('new',(data)=>{
        this.activate();
      });
      window.eventHub.on('save',()=>{
        this.deactivate();
      })
    },
    activate(){
      $(this.view.el).addClass('active');
    },
    deactivate(){
      $(this.view.el).removeClass('active');
    }
  }
  controller.init(view,model);
}