{
  let view={
    el:'.playing > .lyrics > .lyrics-wrapper',
    audio:'.playing > audio',
    renderLyrics(songState){
      let p = $(this.el).find('p');
      let rollingP=[];
      for(var entry of p){
        if(entry.dataset.time){
          rollingP.push(entry);
        }
      }
      rollingP.map((i)=>{
        let curTime = i.dataset.time;
        let nextTime = i.nextElementSibling.dataset.time;
        let curHeight = i.offsetTop;
        if(curTime<= songState.currentTimeInSec && nextTime > songState.currentTimeInSec){
          $(p).css('transform',`translateY(${-curHeight+30}px)`);
          $(i).css('color','#fff').siblings().css('color','#c6b1f085');
        }
      })
    }
  };
  let model={
    data:{id:'',title:'',singer:'',url:'',album:'',isHQ:'',cover:'',lyrics:''},
    songState:{duration:'',currentTime:'',durationInSec:'',currentTimeInSec:'',state:''},
    fetchSong(){
      let query = new AV.Query('Song');
      return query.get(this.data.id).then((res)=>{
        this.data = res.attributes;
        this.data.id = res.id;
        return res
      },(err)=>{console.error(err)})
    },
    processLyrics(data,view){
      let lyricsRaw = data.lyrics;
      let lyrics = lyricsRaw.split('\n');
      let time;
      lyrics.map((i)=>{
        let p = document.createElement('p');
        let reg = /\[([\d:.]+)\](.+)/;
        let match = i.match(reg);
        if(match){
          let min = match[1].split(':')[0];
          let sec = match[1].split(':')[1];
          time= parseInt(min,10)*60+parseFloat(sec,10);
          $(p).attr("data-time",time);
          p.textContent = match[2];
        }else{
          p.textContent = i;
        }
        $(view.el).append(p)
      })
    }
  };
  let controller={
    init(view,model){
      this.view = view;
      this.model = model;
      this.fetchId();
      this.model.fetchSong().then((res)=>{
        this.model.processLyrics(this.model.data,this.view);
      })
      this.bindEvent();
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
    bindEvent(){
      let audio = $(this.view.audio)[0];
      audio.addEventListener('timeupdate',()=>{
        this.model.songState.currentTimeInSec = audio.currentTime;
        console.log('update');
        this.view.renderLyrics(this.model.songState);

      });
    }
  }
  controller.init(view,model)
}