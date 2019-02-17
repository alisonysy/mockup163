{
  let view = {
    el:'.songLi',
    infoTemplate:`
    <div class="songLi-info">
      <table>
        <tbody>
          <tr>
            <td>歌曲</td><td>__title__</td>
          </tr>
          <tr>
            <td>歌手</td><td>__singer__</td>
          </tr>
          <tr>
            <td>URL</td><td>__url__</td>
          </tr>
        </tbody>
      </table>
      <div class="buttons">
        <button type="button" id="edit">编辑</button>
        <button type="button" id="del">删除</button>
      </div>
    </div>
    `,
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
    },
    renderInfo(el,data){
      if(data){
        let child = document.createElement('div');
        if(el.className !== 'active'){
          //child.className = "info-wrapper";
          el.after(child);
          let template = this.infoTemplate
          let placeholder = ['title','singer','url'];
          placeholder.map((i)=>{
            template = template.replace(`__${i}__`,data[i] || '')
          });
          child.outerHTML=template;
          let div = $(el).next('div')[0];
          console.log(el);
          console.log(div);
          $(div).hide().offset();
          $(div).animate({opacity:"toggle"},2000)
          $(el).toggleClass('active');
        }else{
          $(el).toggleClass('active');
          let title = data.title;
          $(el).text(title);
          let info = el.nextElementSibling;
          info.remove();
        }
      }
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
      let query = new AV.Query('Song');
      return query.get(el.dataset.id).then((res)=>{
        this.data = res.attributes;
        this.data.id = res.id;
      },(err)=>{console.error(err)})
    },

  };
  let controller ={
    init(view,model){
      this.view = view;
      this.model = model;
      this.model.findAll();
      this.bindEvent();
      window.eventHub.on('find',(data)=>{
        this.view.render(data);
      })
      window.eventHub.on('save',(data)=>{ //{id,title,singer,url}
        Object.assign(this.model.data,data);
        let curLi = this.findLiWithId(data);
        console.log('returned curLi')
        if(curLi){
          this.view.renderInfo(curLi,data);
          console.log('rendered')
        }else{
          this.view.renderNew(data);
        }
      });
      
    },
    bindEvent(){
      $(this.view.el).on('click','li',(q)=>{
        let curLi = q.currentTarget;
        this.model.findOne(curLi)
          .then(()=>{
            this.view.renderInfo(curLi,this.model.data);
          },(err)=>{console.error(err)})
      });
      //let $select = $(this.view.el).find('.songLi-info > button[id="edit"]');
      $(this.view.el).on('click','.songLi-info > .buttons > button[id="edit"]',(q)=>{
        let cur = q.currentTarget;
        let curLi = $(cur).parent().parent().prev()[0];
        this.model.findOne(curLi)
          .then(()=>{
            let data = this.model.data;
            window.eventHub.emit('edit',data);
          },(err)=>{console.error(err)})
      })
    },
    findLiWithId(data){//{id,title,singer,url}; this fn returns <li>
      let li = $(this.view.el).children();
      console.log(li);
      var curLi;
      for(let i of li){
        if(data.id === i.dataset.id){
          curLi = i;
          console.log(curLi)
          return curLi;
        }
      }
      return curLi;
    }
  }
  controller.init(view,model);
}