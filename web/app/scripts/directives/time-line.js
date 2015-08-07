angular.module('meadMonitorApp')
  .directive('mmTimeLine', ['d3Service', '$window', function (d3Service, $window) {
    return {
      restrict: 'EA',
      scope: {
        data: "=mmData"
      },
      link: function (scope, element, attrs) {
        d3Service.d3().then(function (d3) {
          var margin = parseInt(attrs.margin) || 20;
          var barHeight = parseInt(attrs.barHeight) || 20;
          var barPadding = parseInt(attrs.barPadding) || 5;

          var svg = d3.select(element[0])
            .append('svg')
            .style('width', '100%');

          // Browser onresize event
          window.onresize = function () {
            scope.$apply();
          };

          // Watch for resize event
          scope.$watch(function () {
            return angular.element($window)[0].innerWidth;
          }, function () {
            scope.render(scope.data);
          });

          scope.$watch('data', function (newVals, oldVals) {
            return scope.render(newVals);
          }, true);

          scope.render = function (data) {
            // remove all previous items before render
            svg.selectAll('*').remove();
        
            // If we don't pass any data, return out of the element
            if (!data) {
              return;
            }

            // setup variables
            var width = d3.select(element[0]).node().offsetWidth - margin,
              // calculate the height
              height = scope.data.length * (barHeight + barPadding),
              // Use the category20() scale function for multicolor support
              color = d3.scale.category20(),
              // our xScale
              xScale = d3.scale.linear()
                .domain([0, d3.max(data, function (d) {
                  return d.Temperature;
                })])
                .range([0, width]);

            // set the height based on the calculations above
            svg.attr('height', height);

            //create the rectangles for the bar chart
            svg.selectAll('rect')
              .data(data).enter()
              .append('rect')
              .attr('height', barHeight)
              .attr('width', 140)
              .attr('x', Math.round(margin / 2))
              .attr('y', function (d, i) {
                return i * (barHeight + barPadding);
              })
              .attr('fill', function (d) { return color(d.Temperature); })
              .transition()
              .duration(1000)
              .attr('width', function (d) {
                return xScale(d.Temperature);
              });
          };

        });
      }
    };
  }]);