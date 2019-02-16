{
  let view={
    el:'.addDrop',
    template:`
    <span>拖动本地文件到此区域 <br> 或者</span>
    <div id="button">点击选择本地文件</div>
    <span id="progressText"></span>
    <span class="instructions">目前仅允许从本地上传，暂不支持线上文件</span>
    `,
    render(data){
      $(this.el).html(this.template);
      $(this.el).css("display","flex");
    },
    renderEdit(){
      $(this.el).css("display","none");
    }
  }
  let model={}
  let controller={
    view:null,
    model:null,
    init(view,model){
      this.view = view;
      this.model = model;
      this.view.render();
      window.eventHub.on('new',(data)=>{
        this.view.renderEdit();
      });
      window.eventHub.on('cancel',(data)=>{
        this.view.render();
      })
    },
  }
  controller.init(view,model);
}