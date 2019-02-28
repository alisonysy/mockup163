{
  let view={
    el:'section.page1 > .newSong > ul',
    template:`
    <li>
    <a href="./playSong.html?id=__id__">
      <div class="song-wrapper">
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
    render(data){//data is an array
      let el = $(this.el);
      data.map((data)=>{
        let template = this.template;
        template = template.replace('__id__',data.id||'');
        template = template.replace('__title__',data.title||'');
        template = template.replace('__singer__',data['singer']||'');
        template = template.replace('__album__',data['album']||'');
        if(data.isHQ==="1"){
          template = template.replace('<h6 isHQ="__val__">',"<h6 isHQ='HQ' class='active'>")
        }else{
          template = template.replace(' isHQ="__val__"','')
        }
        $(el).prepend(template);
      })
    },

  }
  let model={
    data:{id:'',title:'',singer:'',url:'',album:'',isHQ:''},
    db_data:[],
    findAll(){
      let query = new AV.Query('Song');
      query.find().then((res)=>{
        let songItem = [];
        res.map((i)=>{
          let item = {};
          item.id = i.id;
          item.title = i.attributes["title"];
          item.singer = i.attributes["singer"];
          item.album = i.attributes["album"];
          item.isHQ = i.attributes["isHQ"];
          item.url = i.attributes["url"];
          return songItem.push(item);
        })
        this.db_data = songItem;
        console.log(this.db_data)
        window.eventHub.emit('find',this.db_data);
        console.log('this.db_data')
      },(err)=>{console.error(err)})
    }
  }
  let controller ={
    view:null,
    model:null,
    init(view,model){
      this.view = view;
      this.model = model;
      this.model.findAll();
      window.eventHub.on('find',(data)=>{
        this.view.render(data);
      })
    }
  }
  controller.init(view,model)
}