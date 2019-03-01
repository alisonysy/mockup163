{
  let view={
    el:'.playing',
    renderPlaying(data){
      let audio = $(this.el).find('audio')[0];
      audio.autoplay = false;
      if($(audio).attr('src')!==data.url){
        $(audio).attr('src',data.url);
      }
      audio.addEventListener('canplaythrough',()=>{
        window.eventHub.emit('songReady',data);
      })
    },
    renderCover(data){
      let cover = $(this.el).find('.rotateImg > .cover-wrapper > .disc-wrapper > .cover')[0]
      $(cover).css({
        'background-repeat':' no-repeat',
        'background-position':' center',
        'background-size': 'cover',
        'background-image':`url('${data.cover}')`
      })
    },
    renderProgress(songState){
      let progress = $(this.el).find('.rotateImg > .cover-wrapper > .disc-wrapper > .progress > .progress-wrapper')[0]
      let bar = $(this.el).find('.rotateImg > .cover-wrapper > .disc-wrapper > .progress > .progress-wrapper > .bar')[0]
      $(progress).attr('data-start',songState.currentTime);
      $(progress).attr('data-end',songState.duration);
      let percent = (songState.currentTimeInSec/songState.durationInSec)*100;
      $(bar).css('width',`${percent}%`);
    }
  };
  let model={
    data:{id:'',title:'',singer:'',url:'',album:'',isHQ:'',cover:''},
    songState:{duration:'',currentTime:'',durationInSec:'',currentTimeInSec:''},
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
      this.bindEvent();
    },
    bindEvent(){
      let audio = $(this.view.el).find('audio')[0];
      window.eventHub.on('songReady',(data)=>{
        this.model.songState.durationInSec = audio.duration;
        let min = Math.floor(audio.duration/60).toString();
        let seconds = Math.round(audio.duration%60);
        let duration;
        if(seconds<10){
          duration = min + ':0' + seconds;
        }else{
          duration = min + ':' + seconds;
        }
        this.model.songState.duration = duration;
        this.view.renderProgress(this.model.songState)
      });
      audio.addEventListener('timeupdate',()=>{
        let min = Math.floor(audio.currentTime/60).toString();
        let seconds = Math.round(audio.currentTime%60);
        let currentTime;
        if(seconds<10){
          currentTime = min + ':0' + seconds;
        }else{
          currentTime = min + ':' + seconds;
        }
        this.model.songState.currentTime = currentTime;
        this.model.songState.currentTimeInSec = audio.currentTime;  
        this.view.renderProgress(this.model.songState);
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


    }
  }
  controller.init(view,model);
}