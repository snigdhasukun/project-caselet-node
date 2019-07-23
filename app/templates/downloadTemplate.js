var downloadTemplate = {
    createTemplate
}

function createTemplate(caselet) {
let technologies = '';
let tools = '';
let tags = '';

caselet.technologies.map((technology) => {
    technologies = technologies + '<span>'+ technology.name + '</span>&nbsp';
});

caselet.tools.map((tool) => {
    tools = tools + '<span>'+ tool.name + '</span>';
});

caselet.tags.map((tag) => {
    tags = tags + '<span style = "border-style: solid; border-width: 1px; border-radius: 10px; padding: 3px; display: inline-block; margin: 0.2rem; padding-left: 10px; padding-right: 10px; border: 1px solid #e6dfcc; background-color: rgba(239, 233, 214, 0); font-size: 13px; color: rgb(76, 77, 77); line-height: 1.333; text-align: left;">'+ tag.name + '</span>';
});

const caseletTemplate = '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">'+
'<div class="container-fluid" id="content" #content>'+
'  <div class="row">'+
'    <div class="col-12">'+
'      <h3 style="font-style: italic; color: #335362">' + caselet.title + '</h3>'+
'      <p style="color: #a2b3bc">| Author\'s Name : ' + caselet.userMid + '</p>'+
'      <hr style="border-top: 2px solid #4e6976; color: #4e6976;">'+
'      <div #customer>'+
'        <h5 style="font-style: italic; color: #335362">The Customer</h5>'+
'        <div [innerHTML]=' + caselet.customer.details + '</div>'+
'      </div>'+
'      <br />'+
'      <br />'+
'      <div #projectDetails>'+
'        <h5 style="font-style: italic; color: #335362">Project Details</h5>'+
'        <div [innerHTML]=' + caselet.projectDetails +'</div>'+
'      </div>'+
'      <br />'+
'      <br />'+
'      <div #need>'+
'        <h5 style="font-style: italic; color: #335362">The Need/Challenge</h5>'+
'        <div [innerHTML]=' + caselet.challenges + '</div>'+
'      </div>'+
'      <br />'+
'      <br />'+
'      <div #solution>'+
'        <h5 style="font-style: italic; color: #335362">The Solution</h5>'+
'        <div [innerHTML]=' + caselet.solution + '</div>'+
'      </div>'+
'      <br />'+
'      <br />'+
'      <div #benefit>'+
'        <h5 style="font-style: italic; color: #335362">Customer and Mindtree benefits</h5>'+
'        <div [innerHTML]=' + caselet.benefits + '</div>'+
'      </div>'+
'      <br />'+
'      <br />'+
'      <div #summary>'+
'        <h5 style="font-style: italic; color: #335362">Executive summary of the caselet</h5>'+
'        <div [innerHTML]=' + caselet.executionSummary + '</div>'+
'      </div>'+
'      <br />'+
'      <br />'+
'      <div #metaData>'+
'        <h5 style="font-style: italic; color: #335362">Meta Data</h5>'+
'        <div style = "font-size: 12px; border: 1px solid #e6dfcc; border-top-right-radius: 1% 5%; border-bottom-right-radius: 1% 5%; border-top-left-radius: 1% 5%; border-bottom-left-radius: 1% 5%;">'+
'          <div style="border-top-right-radius: 1% 8%; border-top-left-radius: 1% 8%; background-color: #f0e9d7; color: #3c6274; padding: 0.5rem;">'+
'            <h6 style="display: inline-block; margin: 0px">' + caselet.title + '&nbsp;|&nbsp;</h6>'+
'            <p style="display: inline-block; margin: 0px">Author\'s Name: ' + caselet.userMid + '</p>'+
'          </div>'+
'          <div class="row">'+
'            <div style="border-right: solid 1px  #e6dfcc;" class="col-3 ml-2">'+
'              <b>Customer:</b>' + caselet.customer.name + ''+
'              <br />'+
'              <b>Account:</b> ' + caselet.account.name + ''+
'              <br />'+
'              <b>Vertical:</b> ' + caselet.vertical.name + ''+
'              <br />'+
'            </div>'+
'            <div style="border-right: solid 1px  #e6dfcc;" class="col-3">'+
'              <b>Technologies:</b>'+ technologies +
'              <br />'+
'              <b>Tools:</b>'+ tools +
'              <br />'+
'              <b>Domain:</b>' + caselet.domain +''+
'              <br />'+
'              <b>Service Offering:</b>' +  caselet.offering.name +''+
'            </div>'+
'            <div style="border-right: solid 1px  #e6dfcc;" class="col">'+
'              <b>Tags:</b>'+ tags +
'              <br />'+
'            </div>'+
'            <div class="col-3">'+
'              <b>Engineering:</b>' + caselet.engineering + ''+
'              <br />'+
'              <b>Practice:</b>' + caselet.practice.name + ''+
'              <br />'+
'              <b>Contract:</b>' + caselet.contract.name +''+
'              <br />'+
'            </div>'+
'          </div>'+
'        </div>'+
'      </div>'+
'      <br />'+
'      <br />'+
'    </div>'+
'  </div>'+
'</div>'+'';

return caseletTemplate;
}


module.exports = downloadTemplate;