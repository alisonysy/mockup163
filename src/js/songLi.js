{
  let view = {
    el:'.songLi',
    template:`
    <li>song1</li>
    <li>song2</li>
    <li>song3</li>
    <li>song4</li>
    <li>song5</li>
    <li>song6</li>
    <li>song7</li>
    <li>song8</li>
    <li>song9</li>
    <li>song10</li>
    `,
    render(){
      $(this.el).html(this.template);
    }
  };
  let model={};
  let controller ={
    init(view,model){
      this.view = view;
      this.model = model;
      this.view.render();
    }
  }
  controller.init(view,model);
}