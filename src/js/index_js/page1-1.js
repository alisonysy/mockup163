{
  let view = {
    ul1:'.ul1',
    ul2:'.ul2',
    renderPlaylist(data){
      let ul1Playlist = data.slice(0,3);
      let ul2Playlist = data.slice(3);
      let ul1Li = $(this.ul1).find('li');
      let ul2Li = $(this.ul2).find('li');
      let ul1Title = $(this.ul1).find('h4');
      let ul2Title = $(this.ul2).find('h4');
      let ul1Cover = $(this.ul1).find('img');
      let ul2Cover = $(this.ul2).find('img');
      for(let index = 0;index<3;index++){
        ul1Li[index].setAttribute('data-id',ul1Playlist[index].id);
        ul1Title[index].textContent = ul1Playlist[index].title;
        ul1Cover[index].src=ul1Playlist[index].cover;
        ul2Li[index].setAttribute('data-id',ul2Playlist[index].id);
        ul2Title[index].textContent = ul2Playlist[index].title;
        ul2Cover[index].src=ul2Playlist[index].cover;
      }
    }
  };
  let model = {
    data:{id:'',title:'',cover:'',intro:'',songs:[]},
    db_data:[],
    findTop6Playlist(){
      let query = new AV.Query('Playlist');
      let placeholders = ['title','cover','intro'];
      return query.find().then((res)=>{
        let playlistItem = [];
        res.reverse().map((i,index)=>{
          if(index<6){
            let item = {};
            item.id = i.id;
            placeholders.map((ii)=>{
              item[ii] = i.attributes[ii];
            })
            return playlistItem.push(item);
          }
          return
        })
        this.db_data = playlistItem;
        console.log(this.db_data);
        window.eventHub.emit('findPlaylist',this.db_data);
      })
    }
  };
  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.bindEvent();
      window.eventHub.on('findPlaylist',(data)=>{
        this.view.renderPlaylist(data);
      })
    },
    bindEvent(){
      this.model.findTop6Playlist();
      $(this.view.ul1).on('click','li',(e)=>{
        let liId = e.currentTarget.dataset.id;
        window.location.href='playlist.html?id='+liId;
      })
      $(this.view.ul2).on('click','li',(e)=>{
        let liId = e.currentTarget.dataset.id;
        window.location.href='playlist.html?id='+liId;
      })
    }
  };
  controller.init(view,model)
}