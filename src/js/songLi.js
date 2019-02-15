{
  let view = {
    el:'.songLi',
    template:``,
    render(data){
      if(data.title){
        let title = data.title;
        $(this.el).prepend(`<li>${title}</li>`);
      }else{
        $(this.el).prepend('');
      }
      //$(this.el).html(this.template);
    }
  };
  let model={
    data:{title:'',singer:'',url:''}
  };
  let controller ={
    init(view,model){
      this.view = view;
      this.model = model;
      this.view.render(this.model.data);
      window.eventHub.on('save',(data)=>{
        Object.assign(this.model.data,data);
        console.log(this.model.data);
        this.view.render(data);
      });

    },

  }
  controller.init(view,model);
}