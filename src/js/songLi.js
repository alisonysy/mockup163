{
  let view = {
    el:'.songLi',
    template:``,
    render(data){
      var $el = $(this.el);
      let id=[];
      data.map(function(i){
        if(i.title){
          let title = i.title;
          $el.prepend(`<li>${title}</li>`);
        }
        return id.push(i.id);
      })
      let li = $el.find('li');
      for(let i of li){
        i.setAttribute('data-id',id.pop())
      }
    },
    renderNew(data){
      if(data.title){
        let title = data.title;
        $(this.el).prepend(`<li>${title}</li>`);
        let li = $(this.el).find('li')[0];
        li.setAttribute('data-id',data.id);
      }else{
        $(this.el).prepend('');
      }
      //$(this.el).html(this.template);
    }
  };
  let model={
    data:{id:'',title:'',singer:'',url:''},
    db_data:[],//array[{id,url,singer,title},{id,url,singer,title}...]
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
        window.eventHub.emit('find',this.db_data);
      },(err)=>{console.error(err)})
    },
    findOne(el){

    }
  };
  let controller ={
    init(view,model){
      this.view = view;
      this.model = model;
      this.model.findAll();
      window.eventHub.on('find',(data)=>{
        this.view.render(data);
      })
      window.eventHub.on('save',(data)=>{ //{id,title,singer,url}
        Object.assign(this.model.data,data);
        console.log(this.model.data);
        this.view.renderNew(data);
      });
      
    },
    bindEvent(){
      $(this.view.el).on('click','li',(q)=>{

      })
    }
  }
  controller.init(view,model);
}