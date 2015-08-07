angular.module('meadMonitorApp')
  .directive('mmTimeLine', ['d3Service', '$window', function (d3Service, $window) {
    return {
      restrict: 'EA',
      scope: {
        data: "=mmData"
      },
      link: function (scope, element) {
        d3Service.d3().then(function (d3) {
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

          scope.$watch('data', function (newVals) {
            return scope.render(newVals);
          }, true);

          scope.render = function (data) {
            // remove all previous items before render
            svg.selectAll('*').remove();
        
            // If we don't pass any data, return out of the element
            if (!data) {
              return;
            }

            data.forEach(function (d) {
              var ts = new Date(d.Timestamp);
              d.Timestamp = ts.getTime() / 1000;
              d.Temperature = d.Temperature;
            });

            var WIDTH = 1000;
            var HEIGHT = 500;
            var MARGINS = {
              top: 20,
              right: 20,
              bottom: 20,
              left: 50
            };
            var xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(data, function (d) {
              return d.x;
            }), d3.max(data, function (d) {
              return d.x;
            })]);

            var yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(data, function (d) {
              return d.y;
            }), d3.max(data, function (d) {
              return d.y;
            })]);
            var xAxis = d3.svg.axis()
              .scale(xRange)
              .tickSize(5)
              .tickSubdivide(true);
            var yAxis = d3.svg.axis()
              .scale(yRange)
              .tickSize(5)
              .orient('left')
              .tickSubdivide(true);

            svg.append('svg:g')
              .attr('class', 'x axis')
              .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
              .call(xAxis);

            svg.append('svg:g')
              .attr('class', 'y axis')
              .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
              .call(yAxis);
          };
        });
      }
    };
  }]);