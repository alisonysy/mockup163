{
  let view = {
    el:'.songs',
    intro:'.intro-content',
    cover:'.cover',
    coverBg:'.info',
    title:'.title>h1',
    template:`
    <li>
      <a href="./playSong.html?id=__id__">
        <div class="songli-wrapper">
          <h4>__title__</h4>
          <h6 isHQ="__val__">__singer__ - __album__</h6>
        </div>
        <div class="play">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-play"></use>
          </svg>
        </div>
      </a>
    </li>
    `,
    renderSongs(db_data){
      let el = $(this.el);
      let placeholders = ['id','title','singer','album'];
      db_data.map((data)=>{
        let template = this.template;
        placeholders.map((i)=>{
          template = template.replace(`__${i}__`,data[i]||'');
        })
        if(data.isHQ==="1"){
          template = template.replace('<h6 isHQ="__val__">',"<h6 isHQ='HQ' class='active'>")
        }else{
          template = template.replace(' isHQ="__val__"','')
        }
        $(el).prepend(template);
      })
    },
    renderInfo(data){
      let title = $(this.title)[0];
      let intro = $(this.intro)[0];
      let cover = $(this.cover)[0];
      let coverBg = $(this.coverBg)[0];
      intro.textContent = data.intro;
      title.textContent = data.title;
      $(coverBg).css('background',`linear-gradient(to bottom,#04031d8a, #04031d8a),
      url('${data.cover}') no-repeat center`);
      $(cover).css('background',`url('${data.cover}') no-repeat center`);
    }
  };
  let model ={
    data:{id:'',cover:'',intro:'',songs:[],title:''},
    songData:{id:'',title:'',singer:'',url:'',album:'',isHQ:''},
    db_data:[],
    fetchPlaylist(id){
      let query = new AV.Query('Playlist');
      return query.get(id).then((res)=>{
        this.data = res.attributes;
        this.data.id = res.id;
        window.eventHub.emit('fetchPlaylist',this.data);
      },(err)=>{console.error(err)})
    },
    findSongs(songArr){
      songArr.map((idStr,index,songArr)=>{
        let query = new AV.Query('Song');
        let id = idStr;
        let temp = {};
        return query.get(id).then((res)=>{
          temp = res.attributes;
          temp.id = res.id;
          this.db_data.push(temp);
        })
          .then(()=>{
            if(this.db_data.length===songArr.length){
              window.eventHub.emit('find',this.db_data);
            }
          })
          .catch((err)=>{console.log(err)})
      })
    }
  };
  let controller={
    init(view,model){
      this.view=view;
      this.model=model;
      this.bindEvent();
      window.eventHub.on('find',(arr)=>{
        this.view.renderSongs(arr);
      })
    },
    bindEvent(){
      this.fetchPlaylistId();
      this.model.fetchPlaylist(this.model.data.id)
        .then(()=>{
          this.model.findSongs(this.model.data.songs);
          this.view.renderInfo(this.model.data);
        });
    },
    fetchPlaylistId(){
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
  };
  controller.init(view,model);
}