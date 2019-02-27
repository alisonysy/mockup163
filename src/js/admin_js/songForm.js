{
  let view = {
    el:'.songDetail',
    template:`
    <form class="form">
      <div class="status">__status__</div>
      <div class="formRow">
        <label for="title">歌名</label>
        <input type="text" id="title" name="title" value="__title__">
      </div>
      <div class="formRow">
        <label for="singer">歌手</label>
        <input type="text" id="singer" name="singer" value="__singer__">
      </div>
      <div class="formRow">
        <label for="url">URL</label>
        <input type="text" id="url" name="url" value="__url__" required>
      </div>
      <input type="submit" value="保存">
      <button type="button" id="cancel">取消</button>
    </form>
    `,
    delNotification:`
      <div class="notify">
        <p>已成功删除歌曲</p>
      </div>
    `,
    renderNew(data){ //data === {url:___,title:___}
      if(data.title){$(this.el).css("display","flex");}
      let placeholder = ['title','singer','url'];
      let template = this.template;
      placeholder.map((string)=>{
        template = template.replace(`__${string}__`,data[string]||'');
      })
      template = template.replace(`__status__`,'新建歌曲');
      $(this.el).html(template);
    },
    renderDefault(){
      $(this.el).css("display","none");
      //$(this.el).attr("hidden")
    },
    renderEdit(data){
      if(data.title){$(this.el).css("display","flex");}
      let placeholder = ['title','singer','url'];
      let template = this.template;
      placeholder.map((string)=>{
        template = template.replace(`__${string}__`, data[string] ||'');
      })
      template = template.replace(`__status__`,'编辑歌曲');
      $(this.el).html(template);
    },
    renderNotification(){
      console.log('1-0')
      let main = $('main');
      main.append(this.delNotification);
      let notify = $('main div:last-child')[0];
      setTimeout(()=>{
        notify.remove();
        console.log('removed');
        window.eventHub.emit('cancel',{});
      },1500);
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
    },
    update(data){
      let song = AV.Object.createWithoutData('Song',data.id);
      song.set('title',data.title);
      song.set('singer',data.singer);
      song.set('url',data.url);
      return song.save();
    },
    reset(){
      this.data = {id:'',title:'',singer:'',url:''}
    }
  };
  let controller = {
    init(view,model){
      this.view=view;
      this.model = model;
      this.view.renderNew({});
      //subscribe to new song uploading event
      window.eventHub.on('new', (data)=>{ //data === {url:___,title:___}
        this.view.renderNew(data);
      });
      window.eventHub.on('edit',(data)=>{
        this.view.renderEdit(data);
        this.model.data.id = data.id;
      });
      window.eventHub.on('delete',(id)=>{
        this.view.renderDefault();
        this.view.renderNotification();
      })
      this.bindEvent();
      $(this.view.el).on('click','button',()=>{
        this.view.renderDefault();
        window.eventHub.emit('cancel',{});
        this.model.reset();
      })
    },
    bindEvent(){
      $(this.view.el).on('submit','form',(q)=>{
        q.preventDefault();
        let details = ['title','singer','url']
        details.map((item)=>{
          let i = q.currentTarget.querySelector(`.form > .formRow > input[id=${item}]`);
          let savVal = i.value;
          this.model.data[item] = savVal;
          console.log(this.model.data);
          //song.set(item,savVal);
        });
        if(this.model.data.id){
          this.model.update(this.model.data)
            .then((res)=>{
              let {id,attributes} = res;
              this.model.data = {id, ...attributes};
              //Object.assign(this.data,res.attributes); // it would replace original input data;
              this.activateSongLi();
            },function(err){
              console.error(err);
            });
        }else{
          this.model.create(this.model.data)
          .then((res)=>{
            let {id,attributes} = res;
            this.model.data = {id, ...attributes};
            //Object.assign(this.data,res.attributes); // it would replace original input data;
            this.activateSongLi();
          },function(err){
            console.error(err);
          });
        };
      })
    },
    activateSongLi(){
      if(this.model.data.title){
        window.eventHub.emit('save',this.model.data);
        this.model.reset();
        this.view.renderDefault();
        window.eventHub.emit('cancel',{});
      }
    },


  }
  controller.init(view,model);
}