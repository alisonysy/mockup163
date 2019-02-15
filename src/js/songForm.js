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
    data:{id:'',title:'',singer:'',url:''},
    create(data){
      let Song = AV.Object.extend('Song');
      let song = new Song();
      song.set('title',data.title);
      song.set('singer',data.singer);
      song.set('url',data.url);
      return song.save();
    }
  };
  let controller = {
    init(view,model){
      this.view=view;
      this.model = model;
      this.view.render({});
      //subscribe to new song uploading event
      window.eventHub.on('new', (data)=>{ //data === {url:___,title:___}
        this.view.render(data);
      });
      this.bindEvent();
    },
    bindEvent(){
      $(this.view.el).on('submit','form',(q)=>{
        q.preventDefault();
        let details = ['title','singer','url']
        details.map((item)=>{
          let i = q.currentTarget.querySelector(`.form > .formRow > input[id=${item}]`);
          let savVal = i.value;
          this.model.data[item] = savVal;
          //song.set(item,savVal);
        });
        this.model.create(this.model.data)
          .then((res)=>{
            let {id,attributes} = res;
            this.model.data = {id, ...attributes};
            //Object.assign(this.data,res.attributes); // it would replace original input data;
            this.activateSongLi();
            this.resetForm();
          },function(err){
            console.error(err);
          });
      })
    },
    activateSongLi(){
      if(this.model.data.title){
        console.log(window.eventHub.events);
        window.eventHub.emit('save',this.model.data);
        console.log(1)
      }
    },
    resetForm(){
      this.view.render({});
    },

  }
  controller.init(view,model);
}