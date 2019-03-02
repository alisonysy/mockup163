{
  let view={};
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
    processLyrics(data){
      let lyricsRaw = data.lyrics;
      let lyrics = lyricsRaw.split('\n');
      let time;
      lyrics.map((i)=>{
        let reg = /\[([\d:.]+)\](.+)/;
        let match = i.match(reg);
        console.log(match);
        if(match){
          let min = match[1].split(':')[0];
          let sec = match[1].split(':')[1];
          time= parseInt(min,10)*60+parseFloat(sec,10);
          console.log(min)
          console.log(time)

        }
      })
    }
  };
  let controller={
    init(view,model){
      this.view = view;
      this.model = model;
      this.fetchId();
      this.model.fetchSong().then((res)=>{
        console.log(this.model.data.lyrics);
        this.model.processLyrics(this.model.data);
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
    }
  }
  controller.init(view,model)
}