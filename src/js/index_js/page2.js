{
  let view = {
    el:'.popSongList',
    updateTime:'.updateTime',
    template:`
    <li>
    <a href="./playSong.html?id=__id__">
      <h1>__order__</h1>
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
    renderSong(dataArr){
      let el = $(this.el);
      let placeholders = ['id','title','singer','album']
      dataArr.map((data,index)=>{
        let template = this.template;
        let order = dataArr.length - index;
        placeholders.map((i)=>{
          template = template.replace(`__${i}__`,data[i]||'');
        })
        if(data.isHQ==="1"){
          template = template.replace('<h6 isHQ="__val__">',"<h6 isHQ='HQ' class='active'>")
        }else{
          template = template.replace(' isHQ="__val__"','')
        }
        template = template.replace('__order__',order);
        $(el).prepend(template);
      })
      let updateTimeEl = $(this.updateTime)[0];
      let curDate = new Date();
      updateTimeEl.textContent = '更新于'+curDate.getFullYear()+'年'+(curDate.getMonth()+1)+'月'+curDate.getDate()+'日'
    }
  };
  let model ={
    data:{id:'',title:'',singer:'',url:'',album:'',isHQ:''},
    db_data:[],
    findPopSong(){
      let query = new AV.Query('Song');
      let placeholders = ['title','singer','album','isHQ','url']
      return query.find().then((res)=>{
        let songItem = [];
        res.map((i)=>{
          let item = {};
          item.id = i.id;
          placeholders.map((ii)=>{
            item[ii]=i.attributes[ii];
          })
          return songItem.push(item);
        })
        this.db_data = songItem;
      }).catch((err)=>{console.log(err)})
    }
  };
  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.bindEvent();
    },
    bindEvent(){
      this.model.findPopSong()
        .then(()=>{
          this.view.renderSong(this.model.db_data);
        });
    }
  };
  controller.init(view,model);
}