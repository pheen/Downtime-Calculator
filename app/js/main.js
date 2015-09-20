app = angular.module('downtimeCalcApp', ['rzModule']);

app.controller('downtimeCalcCtrl', function($scope, $interval) {
  $scope.step    = 1;
  $scope.hours   = 0;
  $scope.minutes = 0;
  $scope.seconds = 0;

  $scope.yearlyRevenue       = 2000000;
  $scope.hoursPerYear        = 2000;
  $scope.impactToSales       = 50;
  $scope.numEmployees        = 15;
  $scope.employeeCostPerHour = 20;
  $scope.percentAffected     = 50;

  calculate = function() {
    lossPerHour = $scope.yearlyRevenue / $scope.hoursPerYear
    totalImpactToSales = lossPerHour * ($scope.impactToSales / 100)

    employeeLossPerHour = ($scope.numEmployees * $scope.employeeCostPerHour)
    totalEmployeeLossPerHour = employeeLossPerHour * ($scope.percentAffected / 100)

    totalLoss = totalImpactToSales + totalEmployeeLossPerHour
    totalLossPerSecond = totalLoss / 3600

    $scope.downtimeCost = totalLossPerSecond * $scope.downtimeSeconds

    $scope.hours    = $scope.downtime.getUTCHours();
    $scope.minutes  = $scope.downtime.getUTCMinutes();
    $scope.seconds  = $scope.downtime.getUTCSeconds();

    $scope.downtimeSeconds += 1;
    $scope.downtime.setTime($scope.downtimeSeconds * 1000);
  }

  $scope.startCalculations = function() {
    $scope.step            = 2;
    $scope.downtimeSeconds = 1; 
    $scope.downtime        = new Date(1000);
    $scope.downtimeCost    = 0;

    calculations = $interval(calculate, 1000)
  }
});

 app.filter('numberFixedLen', function () {
  return function (n, len) {
    var num = parseInt(n, 10);
    len = parseInt(len, 10);

    if (isNaN(num) || isNaN(len)) {
      return n;
    }

    num = '' + num;

    while (num.length < len) {
      num = '0' + num;
    }

    return num;
  };
});
