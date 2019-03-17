{
  let view = {};
  let model = {
    data:{id:'',title:'',cover:'',intro:'',songs:[]},
    db_data:[],
    findTop6Playlist(){
      let query = new AV.Query('Playlist');
      let placeholders = ['title','cover','intro'];
      query.find().then((res)=>{
        let playlistItem = [];
        res.map((i)=>{
          let item = {};
          item.id = i.id;
          placeholders.map((ii)=>{
            item[ii] = i.attributes[ii];
          })
          return playlistItem.push(item);
        })
        this.db_data = playlistItem;
        console.log(this.db_data)
      },(err)=>{console.error(err)})
    }
  };
  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.bindEvent();
    },
    bindEvent(){
      this.model.findTop6Playlist();
    }
  };
  controller.init(view,model)
}