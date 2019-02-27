{
  let view={
    el:'section.page1 > .newSong > ul',
    template:`
    <li>
      <div class="song-wrapper">
        <h4>__title__</h4>
        <h6>__singer__-只要有相见的人，就不是孤身一人</h6>
      </div>
      <div class="play">
        <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-play"></use>
        </svg>
      </div>
    </li>
    `,
    render(data){//data is an array
      console.log(data);
      let el = $(this.el);
      let template = this.template;
      data.map((data)=>{
        let title=data.title;
        let singer=data.singer;
        let dataObj = {title:title,singer:singer}
        console.log(dataObj.title);
        template = template.replace('__title__',dataObj.title||'');
        template = template.replace('__singer__',dataObj['singer']||'');
      })
      $(el).append(template);
    },

  }
  let model={
    data:{id:'',title:'',singer:'',url:''},
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