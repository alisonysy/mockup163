{
  let view={
    el:'section.page1 > .newSong > ul',
    template:`
    <li data-id=__did__>
    <a href="./playSong.html?id=__id__" target="_blank">
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
        template = template.replace('__did__',data.id||'');
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
    data:{id:'',title:'',singer:'',url:'',album:'',isHQ:'',count:0},
    db_data:[],
    findAll(){
      let query = new AV.Query('Song');
      let placeholders = ['title','singer','album','isHQ','url','count']
      query.find().then((res)=>{
        let songItem = [];
        res.map((i)=>{
          let date = i.createdAt.getTime();
          let item = {};
          item.id = i.id;
          item.date = date;
          placeholders.map((ii)=>{
            item[ii]=i.attributes[ii];
          })
          return songItem.push(item);
        })
        this.db_data = songItem;
        function bubbleSort(input) {
          let sorted = [];
          while (input.length) {
            for (let i = 0; i < input.length - 1; i++) {
              if (input[i].date > input[i + 1].date) {
                let temp = input[i];
                input[i] = input[i + 1];
                input[i + 1] = temp;
              }
            };
            sorted.unshift(input.pop());
          }
          return sorted;
        }
        this.db_data = bubbleSort(this.db_data);
        window.eventHub.emit('find',this.db_data);
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
      });
      this.bindEvent();
    },
    bindEvent(){
      $(this.view.el).on('click','li',(e)=>{
        let song = e.currentTarget;
        let id=song.dataset.id;
        window.eventHub.emit('count',id);
      })
    }
    
  }
  controller.init(view,model)
}