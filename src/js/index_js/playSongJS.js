{
  let view={
    el:'.playing',
    template:`
    <audio controls src="__url__">
      <p>呀呀呀，看来小可爱你的浏览器不支持这个音频格式哇</p>
    </audio>
    `,
    renderPlaying(data){
      let template = this.template;
      //template = template.replace('__cover__',data.cover);
      template = template.replace('__url__',data.url);
      $(this.el).append(template);
    },
    renderCover(data){
      let cover = $(this.el).find('.rotateImg > .cover-wrapper > .disc-wrapper > .cover')[0]
      $(cover).css({
        'background-repeat':' no-repeat',
        'background-position':' center',
        'background-size': 'cover',
        'background-image':`url('${data.cover}')`
      })
    }
  };
  let model={
    data:{id:'',title:'',singer:'',url:'',album:'',isHQ:'',cover:''},
    fetchSong(){
      let query = new AV.Query('Song');
      return query.get(this.data.id).then((res)=>{
        this.data = res.attributes;
        this.data.id = res.id;
        return res
      },(err)=>{console.error(err)})
    }
  };
  let controller={
    init(view,model){
      this.view = view;
      this.model = model;
      this.fetchId();
      this.model.fetchSong().then((res)=>{
        console.log(this.model.data);
        this.view.renderPlaying(this.model.data);
        this.view.renderCover(this.model.data);
      });
    },
    fetchId(){
      let winSearch = window.location.search;
      if(winSearch.indexOf('?')!==-1){
        if(winSearch.indexOf('id=')!==-1){
          winSearch = winSearch.substring(4);
        }else{
          winSearch = winSearch.substring(1);
        }
      }
      let id = {id:winSearch};
      Object.assign(this.model.data,id);
    }
  }
  controller.init(view,model);
}