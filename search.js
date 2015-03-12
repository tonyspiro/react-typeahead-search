/* Search
==================================== */
$('#searchModal').on('shown.bs.modal', function(){
  
  $(document).unbind('keydown');
  
  $('#search').focus();

  // List component
  var SearchList = React.createClass({

    // Gets initial state, duh
    getInitialState: function() {
      return {
        data: []
      };
    },

    // Checks for data loaded via ajax
    componentDidMount: function() {
      
      // We'll need to use the global this later, store lika dis
      var _this = this;
      var url = 'ajax/data.json';

      $.getJSON(url, function(data){
        
        $('#search').on('keyup', function(){
        
          var q = $(this).val();

          var items = data.items;
          var newItems = [];
          
          // Do your searching here
          items.forEach(function(item, i){
            
            var qLower = q.toLowerCase();
            var titleLower = item.title.toLowerCase();
            var contentLower = item.content.toLowerCase();
            
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
              data : {
                items: newItems
              }
            });
          }

        });

        /// Get arrow controls
        $(document).on('keydown', function(e){
          
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
            window.location.href = link;
            break;

            default: return; // exit this handler for other keys
          }
          e.preventDefault(); // prevent the default action (scroll / move caret)
        });

        $('#searchModal').on('hidden.bs.modal', function(){
          $('#search-results').removeClass('open');
          $('#search-results ul').html('');
          $('#search').val('');
        });

      }.bind(this));

    },  

    render: function() {

      var rows;
      var items = this.state.data.items;

      if(items){

        rows = items.map(function(item, i) {
          
          return(
            <ListItem item={item} id={i}/>
          );
        
        }.bind(this));

      }

      return (
        <ul>
          {rows}
        </ul>
      );
     
    }

  });

  var ListItem = React.createClass({

    render : function(){

      var item = this.props.item;
      var id = this.props.id;

      return (
        <li>
          <a href={item.slug} className="result" id={"result-" + id} data-id={id}>
            <div className="pull-left icon">
              <i className={"fa " + item.icon}></i>
            </div>
            <div className="pull-left title">
              {item.title}
            </div>
          </a>
        </li>
      );
    }
  });

  React.render(<SearchList />, document.getElementById('search-results'));

}); // modal opened
