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
      window.eventHub.on('upload',(data)=>{
        this.activate();
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