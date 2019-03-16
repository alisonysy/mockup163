{
  let view = {
    el:'main',
    aside:'.playlist',
    findli(){
      this.li=$(this.aside).find('li');
      return this.li;
    },
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
        $(option).append(`<option value="${id}" class="">${str}</option>`);
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
      });
      window.eventHub.emit('renderedLi',this.findli())
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
    },
    renderEdit(data){
      let placeholders = ['title','cover','intro'];
      let form = $(this.el).find('form')[0];
      placeholders.map((name)=>{
        let item = $(form).find(`[name=${name}]`)[0];
        item.value=data[name];
      })
    },
    resetForm(){
      let placeholders = ['title','cover','intro'];
      let form = $(this.el).find('form')[0];
      let arr=[];
      placeholders.map((name)=>{
        let item = $(form).find(`[name=${name}]`)[0];
        arr.push(item);
      })
      arr.map((input)=>{
        input.value='';
      })
    }
  };
  let model = {
    data:{title:'',cover:'',intro:'',songs:'',id:''},
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
    fetchPlaylist(id){
      let query = new AV.Query('Playlist');
      return query.get(id).then((res)=>{
        this.data = res.attributes;
        this.data.id = res.id;
        window.eventHub.emit('fetchPlaylist',this.data);
      },(err)=>{console.error(err)})
    },
    fetchAllPlaylists(){
      let query = new AV.Query('Playlist');
      return query.find().then((res)=>{
        let playlistItem = [];
        res.map((i)=>{
          let item = {};
          let placeholders = ['title','cover','intro','songs'];
          item.id = i.id;
          placeholders.map((ii)=>{
            item[ii] = i.attributes[ii];
          })
         playlistItem.push(item);
        })
        this.data = playlistItem;
        window.eventHub.emit('fetchAllPlaylists',this.data);
      },(err)=>{console.error(err)})
    },
    reset(){
      this.data = {title:'',cover:'',intro:'',songs:'',id:''}
    }
  };
  let controller ={
    init(view, model){
      this.view = view;
      this.model = model;
      this.model.fetchAllPlaylists();
      this.model.fetchSongs();
      this.bindEvent();
      window.eventHub.on('fetchAllPlaylists',(data)=>{
        this.view.renderPlaylistAside(data);
        console.log(this.view.findli());
        this.model.reset();
      });
      window.eventHub.on('save',(data)=>{
        this.view.renderNewPlaylist(data);
        this.view.resetForm();
      });
      window.eventHub.on('fetchSongs',(data)=>{
        this.view.renderSongs(data);
      });
      window.eventHub.on('fetchPlaylist',(data)=>{
        this.view.renderEdit(data);
      })
    },
    bindEvent(){
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
      });
      $(this.view.aside).on('click','li',(e)=>{
        let li = e.currentTarget;
        this.model.data.id = li.dataset.id;
        this.model.fetchPlaylist(this.model.data.id);
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