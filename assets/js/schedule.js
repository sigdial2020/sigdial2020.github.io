Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
}
$(document).ready(function() {

    $.when(
        $.ajax({
           type: "GET",
           url: "/content/schedule.csv",
           //dataType: "text",
           success: function(data1){
                schedule = data1;
            }
        }),
        $.ajax({
           type: "GET",
           url: "/content/grouping2.csv",
           //dataType: "text",
           success: function(data2){
                return data2;
            }
        })
    ).done(function ( v1, v2 ) {
        process(v1[0],v2[0])}

    )


    function process(schedule,grouping){
        papers_parsed=Papa.parse(grouping).data.slice(1)
        papers={}
        for (paper in papers_parsed){
            papers[papers_parsed[paper][0]]=papers_parsed[paper]
        }
        console.log(papers)

        table_data=Papa.parse(schedule).data.slice(1)
        //table_html='<table class="col-md-12 board text-center"></table>'
        //tables={tab1: $(table_html),tab2: $(table_html),tab3: $(table_html)}


        $(table_data).each(function (i, rowData) {
            if (rowData[2]=="Break"){
            return;}
            var row = $('<tr class="col-md-9 col-sm-12" id=schedule_'+i+'></tr>');
            dates=get_dates(rowData[1],rowData[0][2])

            for (index = 0; index < dates.length; index++){
                row.append("<td>"+dates[index]+"</td>")
            }

            div_=$('<td></td>')

            div=$('<div class="member stephen"></div>')
            title='<a name="oral1" href="#" class="btn-large bg-2"><img src="assets/img/microphone.png" alt="">'+rowData[2]+'</a>'

            div.append($('<div class="button">'+title+'</div><h4>'+rowData[3]+'</h4></div>'))
            papers_ids=rowData[4].split(", ")

            for (idx in papers_ids){
                paper_id=papers_ids[idx]
                if (paper_id in papers){
                    div.append($("<p><bold>"+papers[paper_id][2]+papers[paper_id][1]+" <br></p>"))
            }}

            div_.append(div)
            row.append(div_)

            day_key="tab"+rowData[0][2]
            //tables[day_key].append(row);
            $("#"+day_key).append(row)
        });



    }

    function get_dates(date, day){
        countries=[-7,-6,-4,2,5.50,8,9]
        date_split=date.split(":")
        times=[]
        var d = new Date(2020, 7, day, date_split[0]-7, date_split[1], 0, 0);

        for (index = 0; index < countries.length; index++){
            date_=new Date(d.getTime())
            date_.setHours(date_.getHours()+countries[index])
            //local_time=new Date(2020,7,day,date_split[0],date_split[1]+countries[index],0,0)
            //var time = d.toLocaleString("en-GB", {timeZone: "Japan"});
            var time = date_.toLocaleString("en-GB");
            times.push(time.split(" ")[1].slice(0,5))
        }
        return times
    }

    function get_docs(){
        $.ajax({
           type: "GET",
           url: "/content/schedule.csv",
           dataType: "text",
           success: process
        });

    }



   });
