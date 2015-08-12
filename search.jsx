/* Search
==================================== */
$('#searchModal').on('shown.bs.modal', function(){

  // Search Main
  var SearchArea = React.createClass({

    // Gets initial state
    getInitialState: function() {
      return {
        data: {
          items: []
        }
      };
    },

    componentDidMount: function(){
      
      $('#search').focus();
    
    },

    getResults: function(e){

      var _this = this;

      var date = new Date();
      var q = $('#search').val();
      var api_url = this.props.api_url;
      
      switch(e.which) {
              
        case 38: // up
        var currentId = $('#search-results .result.active').attr('data-id');
        var prevId = parseInt(currentId, 10) - 1;
        $('#search-results .result').removeClass('active');
        if(!$('#search-results #result-' + prevId).length) return false;
        $('#search-results #result-' + prevId).addClass('active');
        break;

        case 40: // down
        if(!$('#search-results .result.active').length){
          
          $('#search-results .result').first().addClass('active');

        } else {
          
          var currentId = $('#search-results .result.active').attr('data-id');
          var nextId = parseInt(currentId, 10) + 1;
          if(!$('#search-results #result-' + nextId).length) return false;
          $('#search-results .result').removeClass('active');
          $('#search-results #result-' + nextId).addClass('active');
        
        }
        break;

        case 13: // enter
        var link = $('#search-results .result.active').attr('href');
        window.open(link);
        break;

        default: 

        var q = $('#search').val();
        var url = api_url + '?q=' + q + '&time=' + date.getTime(); // for yo cache

        $.getJSON(url, function(data){

          var items = data.items;
          var newItems = [];
          var q = $('#search').val();

          // Do your searching here
          items.forEach(function(item, i){
            
            var qLower = q.toLowerCase();
            var titleLower = item.title.toLowerCase();
            var contentLower = item.content.toLowerCase();
            var formattedTitle = highlight(item.title, q);
            var formattedContent = highlight(item.content, q);
            
            item.formattedContent = formattedContent;
            item.formattedTitle = formattedTitle;
            
            // Add custom search criteria here
            if(titleLower.indexOf(qLower)!==-1 || 
              contentLower.indexOf(qLower)!==-1){
              newItems.push(item);
            }

          });

          if(!q) newItems = [];
          
          if(!newItems.length){
          
            $('#search-results').removeClass('open');
          
          } else {

            $('#search-results').addClass('open');
          
          }

          if (_this.isMounted()){
            _this.setState({
              data: {
                items: newItems
              }
            });
          }

        });

        return; // exit this handler for other keys
      }
    },

    render: function(){

      return (
        <div>
          <input id="search" onKeyDown={this.getResults} type="text" placeholder={this.props.placeholder} />
          <SearchList items={this.state.data.items}/>
        </div>
      );
    }
  });

  // List Component
  var SearchList = React.createClass({

    render: function() {

      var rows;
      var items = this.props.items;
      
      if(items){

        rows = items.map(function(item, i) {
          
          return(
            <ListItem item={item} id={i}/>
          );
        
        }.bind(this));

      }

      return (
        <ul id="search-results">
          {rows}
        </ul>
      );
     
    }

  });

  // List Item
  var ListItem = React.createClass({

    render: function(){

      var item = this.props.item;
      var id = this.props.id;
      
      return (
        <li>
          <a target="_blank" href={item.link} className="result" id={"result-" + id} data-id={id}>
            <i className={"fa " + item.icon}></i>
            &nbsp;&nbsp;&nbsp;
            <span className="description" dangerouslySetInnerHTML={{__html: item.formattedTitle}}></span>
            <br/>
            <span className="description" dangerouslySetInnerHTML={{__html: item.formattedContent}}></span>
          </a>
        </li>
      );
    }
  });

  React.render(<SearchArea api_url="api/data.json" placeholder="Search your favorite websites..." />, document.getElementById('search-area'));


}); // modal opened

function preg_quote( str ) {
  return (str+'').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
}

function highlight(data, search){
    return data.replace( new RegExp( "(" + preg_quote( search ) + ")" , 'gi' ), "<b>$1</b>" );
}
