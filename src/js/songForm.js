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
    render(data={}){
      let placeholder = ['title','singer','url'];
      let template = this.template;
      placeholder.map((string)=>{
        template = template.replace(`__${string}__`,data[string]||'');
      })
      $(this.el).html(template);
    }
  };
  let model = {

  };
  let controller = {
    init(view,model){
      this.view=view;
      this.model = model;
      this.view.render(this.model.data);
      window.eventHub.on('upload',(data)=>{
        this.view.render(data)
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