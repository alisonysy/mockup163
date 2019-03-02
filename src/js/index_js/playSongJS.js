{
  let view={
    el:'.playing',
    discWrap:'.playing > .rotateImg > .cover-wrapper > .disc-wrapper',
    title:'.playing > .rotateImg > .cover-wrapper > .disc-wrapper > .progress > .title-wrapper',
    cover:'.playing > .rotateImg > .cover-wrapper > .disc-wrapper > .cover',
    disc:'.playing > .rotateImg > .cover-wrapper > .disc-wrapper > .disc',
    renderPlaying(data){
      let audio = $(this.el).find('audio')[0];
      let title = $(this.title).find('h2')[0];
      let singer = $(this.title).find('h4')[0];
      let playButton = $(this.title).find('#play');
      $(playButton).addClass('onplay');
      $(title).text(data.title);
      $(singer).text(data.singer);
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
      if(cover){
        $(cover).css({
          'background-repeat':' no-repeat',
          'background-position':' center',
          'background-size': 'cover',
          'background-image':`url('${data.cover}')`
        })
      }
    },
    rotateCover(){
      let cover = $(this.cover);
      let disc = $(this.disc);
      let pauseButton= $(this.title).find('#pause');
      console.log(pauseButton)
      let playButton = $(this.title).find('#play');
      $(cover).addClass('active');
      $(disc).addClass('active');
      $(pauseButton).addClass('onplay');
      $(playButton).removeClass('onplay');
    },
    stopRotateCover(){
      let cover = $(this.el).find('.rotateImg > .cover-wrapper > .disc-wrapper > .cover')[0];
      let disc = $(this.el).find('.rotateImg > .cover-wrapper > .disc-wrapper > .disc')[0];
      let playButton = $(this.title).find('#play');
      let pauseButton= $(this.title).find('#pause');
      $(cover).removeClass('active');
      $(disc).removeClass('active');
      $(playButton).addClass('onplay');
      $(pauseButton).removeClass('onplay');
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
    songState:{duration:'',currentTime:'',durationInSec:'',currentTimeInSec:'',state:''},
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
      this.getHeight();
      this.bindEvent();

    },
    bindEvent(){
      let audio = $(this.view.el).find('audio')[0];
      let bar = $(this.view.el).find('.rotateImg > .cover-wrapper > .disc-wrapper > .progress > .progress-wrapper')[0];
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
        this.updateTime();
      });
      audio.addEventListener('play',()=>{
        this.view.rotateCover();
      });
      audio.addEventListener('pause',()=>{
        this.view.stopRotateCover();
      })
      audio.addEventListener('ended',()=>{
        this.view.stopRotateCover();
      })
      this.setTime();
      this.stopAndPlay();
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
    updateTime(){
      let audio = $(this.view.el).find('audio')[0];
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
    },
    setTime(){
      let audio = $(this.view.el).find('audio')[0];
      let bar = $(this.view.el).find('.rotateImg > .cover-wrapper > .disc-wrapper > .progress > .progress-wrapper')[0];
      let barLeft = bar.getBoundingClientRect().left;
      bar.addEventListener('click',function(e){
        let position = (e.pageX-barLeft)/this.offsetWidth;
        audio.currentTime=position*audio.duration;
      })
    },
    stopAndPlay(){
      let playButton = $(this.view.title).find('#play')[0];
      let audio = $(this.view.el).find('audio')[0];
      let pauseButton = $(this.view.title).find('#pause')[0];
      console.log(pauseButton)
      pauseButton.addEventListener('click',function(){
        console.log(pauseButton)
        console.log('clicked')
        audio.pause()
        console.log('pauseButton')
      })
      playButton.addEventListener('click',function(){
        audio.play()
      })
    },
    getHeight(){
      let box = $(this.view.el).find('#test')[0];
      let singer_h4 = $(this.view.title).find('h4')[0];
      let boxH = box.getBoundingClientRect().top;
      let singer_h4H = singer_h4.getBoundingClientRect().bottom;
      let distance = boxH-singer_h4H;
      let lyricsBox = $(this.view.el).find('.lyrics');
      if(distance>100){
        $(lyricsBox).css('height','23%')
      }else{
        $(lyricsBox).css('height','13%')
      }
    }
  }
  controller.init(view,model);
}