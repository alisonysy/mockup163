{
  let view = {
    el:'.songDetail',
    template:`
    <form class="form">
      <div class="formRow">
        <label for="title">Title</label>
        <input type="text" id="title" name="title" value="__title__">
      </div>
      <div class="formRow">
        <label for="singer">Singer</label>
        <input type="text" id="singer" name="singer" value="__singer__">
      </div>
      <div class="formRow">
        <label for="url">URL</label>
        <input type="text" id="url" name="url" value="__url__">
      </div>
      <input type="submit" value="Save">
    </form>
    `,
    render(data){ //data === {url:___,title:___}
      let placeholder = ['title','singer','url'];
      let template = this.template;
      placeholder.map((string)=>{
        template = template.replace(`__${string}__`,data[string]||'');
      })
      $(this.el).html(template);
    }
  };
  let model = {
    data:{},
  };
  let controller = {
    init(view,model){
      this.view=view;
      this.model = model;
      this.view.render({});
      //subscribe to new song uploading event
      window.eventHub.on('new', (data)=>{ //data === {url:___,title:___}
        this.view.render(data);
        /*if(this.model.data.id){
          this.model.data = {
            name: '', url: '', id: '', singer: '', lyrics: ''
          }
        }else{
          Object.assign(this.model.data, data)
        }
        this.view.render(this.model.data)*/
      })
    },
    bindEvent(){
      $(this.view.el).on('submit','form',(q)=>{
        q.preventDefault();
        let 
      })
    }

  }
  controller.init(view,model);
}