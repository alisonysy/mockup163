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
        <input type="text" id="url" name="url" value="__url__" required>
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
      });
      this.bindEvent();
    },
    bindEvent(){
      $(this.view.el).on('submit','form',(q)=>{
        q.preventDefault();
        let details = ['title','singer','url'];
        let Song = AV.Object.extend('Song');
        let song = new Song();
        details.map((item)=>{
          let i = q.currentTarget.querySelector(`.form > .formRow > input[id=${item}]`);
          let savVal = i.value;
          song.set(item,savVal);
          song.save().then(function(res){
            console.log(res.attributes); //returns an obj {title:__,url:__,singer:__}
          },function(err){
            console.error(err);
          })
        })
      })
    }

  }
  controller.init(view,model);
}