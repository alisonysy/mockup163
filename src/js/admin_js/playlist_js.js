{
  let view = {
    el:'main',
    aside:'.playlist',
    renderSongs(songData){
      let option = $(this.el).find('#chooseSong')[0];
      songData.map((song)=>{
        let id="";
        let str="";
        for(let key in song){
          id = song.id;
          let name = song["title"];
          let singer = song["singer"];
          let album = song["album"];
          str = name + "  " + singer+ "  "+album;
        }
        $(option).append(`<option value="${id}">${str}</option>`);
      })
    },
    renderPlaylistAside(playlistArr){
      playlistArr.map((playlist)=>{
        let id = playlist.id;
        let title=playlist.title;
        let intro=playlist.intro;
        $(this.aside).prepend(
          `<li data-id="${id}">
          <div>
          <p class="playlistTitle">${title}</p>
          <p class="playlistIntro">${intro}</p>
          </div>
          </li>`
          );
      })
    },
    renderNewPlaylist(data){
      let id=data.id;
      let title = data.title;
      let intro = data.intro;
      $(this.aside).prepend(
        `<li data-id="${id}">
        <div>
        <p class="playlistTitle">${title}</p>               
        <p class="playlistIntro">${intro}</p>
        </div>
        </li>`
      );
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
      let placeholders = ['title','cover','intro','songs'];
      placeholders.map((i)=>{
        playlist.set(i,data[i]);
      });
      return playlist.save();
    },
    fetchAllPlaylists(){
      let query = new AV.Query('Playlist');
      query.find().then((res)=>{
        let playlistItem = [];
        res.map((i)=>{
          let item = {};
          let placeholders = ['title','cover','intro','songs'];
          item.id = i.id;
          placeholders.map((ii)=>{
            item[ii] = i.attributes[ii];
          })
          return playlistItem.push(item);
        })
        this.data = playlistItem;
        console.log(this.data);
        window.eventHub.emit('fetchAllPlaylists',this.data);
      },(err)=>{console.error(err)})
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
      window.eventHub.on('save',(data)=>{
        this.view.renderNewPlaylist(data);
      })
    },
    bindEvent(){
      this.model.fetchAllPlaylists();
      window.eventHub.on('fetchAllPlaylists',(data)=>{
        this.view.renderPlaylistAside(data);
        this.model.reset();
      })
      this.model.fetchSongs();
      window.eventHub.on('fetchSongs',(data)=>{
        this.view.renderSongs(data);
      })
      let form = $(this.view.el).find('form')[0];
      form.addEventListener('submit',(e)=>{
        e.preventDefault();
        let formEl = e.currentTarget;
        this.getFormData(formEl);
        this.model.createPlaylist(this.model.data)
          .then(()=>{
            window.eventHub.emit('save',this.model.data);
            this.model.reset();
          })
          .catch((err)=>{console.log(err)});
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