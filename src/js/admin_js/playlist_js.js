{
  let view = {
    el:'main',
    renderSongs(songData){
      songData.map((song)=>{
        let str="";
        for(let key in song){
          str += key + ':' + song[key] + "  ";
        }
        console.log(str);
      })
    }
  };
  let model = {
    data:{title:'',cover:'',intro:'',songs:''},
    songData:{id:'',title:'',singer:'',album:'',isHQ:''},
    fetchSongs(){
      let query = new AV.Query('Song');
      query.find().then((res)=>{
        let songItem = [];
        res.map((i)=>{
          let item = {};
          let placeholders = ['title','singer','album','isHQ'];
          item.id = i.id;
          placeholders.map((ii)=>{
            item[ii] = i.attributes[ii];
          })
          return songItem.push(item);
        })
        this.songData = songItem;
        console.log(this.songData);
        window.eventHub.emit('fetchSongs',this.songData);
      },(err)=>{console.error(err)})
    },
    createPlaylist(data){
      let Playlist = AV.Object.extend('Playlist');
      let playlist = new Playlist();
      song.set('title',data.title);
      song.set('singer',data.singer);
      song.set('album',data.album);
      song.set('url',data.url);
      song.set('isHQ',data.isHQ);
      song.set('cover',data.cover);
      song.set('lyrics',data.lyrics);
      return song.save();
    },
    fetchPlaylist(){

    },
    reset(){
      this.data = {title:'',cover:'',intro:'',songs:''}
    }
  };
  let controller ={
    init(view, model){
      this.view = view;
      this.model = model;
      this.bindEvent();
    },
    bindEvent(){
      this.model.fetchSongs();
      window.eventHub.on('fetchSongs',(data)=>{
        this.view.renderSongs(data);
      })
      let form = $(this.view.el).find('form')[0];
      form.addEventListener('submit',(e)=>{
        e.preventDefault();
        let formEl = e.currentTarget;
        this.getFormData(formEl);
      })
    },
    getFormData(form){
      this.model.reset();
      let placeholders = ['title','cover','intro'];
      placeholders.map((i)=>{
        let savVal = $(form).find(`[name=${i}]`)[0].value;
        this.model.data[i]=savVal;        
      });
      let selectedSong = $(form).find(`[name=chooseSong]`)[0].selectedOptions;
      let songs;
      for(let key of selectedSong){
        this.model.data.songs += key.value +' ';
        //turn the string into an array;
        songs = this.model.data.songs.trim().split(' ');
      }
      this.model.data.songs = songs;
      console.log(this.model.data);
    }
  };
  controller.init(view, model);
}