{
  let view = {};
  let model={
    data:{id:'',title:'',singer:'',url:'',album:'',isHQ:'',count:0},
    findSong(id){
      let query = new AV.Query('Song');
      return query.get(id).then((res)=>{
        this.data = res.attributes;
        this.data.id = res.id;
      },(err)=>{console.error(err)});
    },
    updateCount(){
      let song = AV.Object.createWithoutData('Song',this.data.id);
      this.data.count += 1;
      let count = this.data.count;
      song.set('count',count);
      return song.save();
    },
  };
  let controller={
    init(view,model){
      this.view=view;
      this.model = model;
      window.eventHub.on('count',(id)=>{
        this.model.findSong(id)
          .then(()=>{
            this.model.updateCount();
          })
      })
    }

  };
  controller.init(view,model)
}