{
  let view={
    el:'.playing',
    template:`

    `,
    renderPlaying(data){
      let audio = $(this.el).find('audio')[0];
      audio.autoplay = false;
      if($(audio).attr('src')!==data.url){
        $(audio).attr('src',data.url);
      }
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
        window.eventHub.emit('songReady',this.model.data);
      });
      window.eventHub.on('songReady',(data)=>{
        let audio = $(this.view.el).find('audio')[0];
        let button = document.getElementById('audio');
        button.onclick=function(){
          audio.play();
        }
        console.log('1')
        //this.progress();
      })
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
    },
    progress(){
      let playback = $(this.view.el).find('audio')[0];
      playback.play().then((res)=>{
        console.log(res)
      }).catch((err)=>{console.log(err)})
      console.log('2')
      let length = playback.duration;
      console.log(length);

    }
  }
  controller.init(view,model);
}