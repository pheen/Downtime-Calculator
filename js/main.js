app = angular.module('downtimeCalcApp', ['rzModule', 'fcsa-number']);

app.controller('downtimeCalcCtrl', function($scope, $interval) {
  $scope.step    = 1;
  $scope.hours   = 0;
  $scope.minutes = 0;
  $scope.seconds = 0;
  $scope.showConfig = false;
  $scope.incrementSize = 30;
  $scope.incrementType = 'minutes';
  $scope.calculationToggle = 'Pause';

  $scope.yearlyRevenue       = 2000000;
  $scope.hoursPerYear        = 2000;
  $scope.impactToSales       = 75;
  $scope.numEmployees        = 15;
  $scope.employeeCostPerHour = 20;
  $scope.percentAffected     = 65;

  $scope.calculateCosts = function() {
    lossPerHour = $scope.yearlyRevenue / $scope.hoursPerYear;
    totalImpactToSales = lossPerHour * ($scope.impactToSales / 100);

    employeeLossPerHour = ($scope.numEmployees * $scope.employeeCostPerHour);
    totalEmployeeLossPerHour = employeeLossPerHour * ($scope.percentAffected / 100);

    totalLoss = totalImpactToSales + totalEmployeeLossPerHour;
    totalLossPerSecond = totalLoss / 3600;

    $scope.downtimeCost = totalLossPerSecond * $scope.downtimeSeconds;
    $scope.downtimeSeconds += 0.1;
    $scope.downtime.setTime($scope.downtimeSeconds * 1000);
  }

  $scope.calculateTimes = function() {
    $scope.hours   = Math.floor($scope.downtime.getTime() / 1000 / 60 / 60);
    $scope.minutes = $scope.downtime.getUTCMinutes();
    $scope.seconds = $scope.downtime.getUTCSeconds();
  }

  $scope.startCalculations = function() {
    $scope.step            = 2;
    $scope.downtimeSeconds = 0.0;
    $scope.downtime        = new Date(0);
    $scope.downtimeCost    = 0;

    $scope.calculateCostsInterval = $interval($scope.calculateCosts, 100);
    $scope.calculateTimesInterval = $interval($scope.calculateTimes, 100);
  }

  $scope.stopCalculations = function() {
    $interval.cancel($scope.calculateCostsInterval);
    $interval.cancel($scope.calculateTimesInterval);
    $scope.calculateCostsInterval = undefined;
    $scope.calculateTimesInterval = undefined;

    $scope.cancelTimeWatch = $scope.$watchCollection('[hours, minutes, seconds]', function(val) {
      var hours   = val[0];
      var minutes = val[1];
      var seconds = val[2];

      if (hours !== '' && minutes !== '' && seconds !== '') {
        totalMiliseconds = 0;
        totalMiliseconds += hours * 3600000;
        totalMiliseconds += minutes * 60000;
        totalMiliseconds += seconds * 1000;

        $scope.downtime.setTime(totalMiliseconds);
        $scope.downtimeSeconds = totalMiliseconds / 1000;
        $scope.calculateCosts();
      }
    });
  }

  $scope.resumeCalculations = function() {
    $scope.cancelTimeWatch();
    $scope.calculateCostsInterval = $interval($scope.calculateCosts, 100);
    $scope.calculateTimesInterval = $interval($scope.calculateTimes, 1000);
  }

  $scope.toggleCalculations = function() {
    if ($scope.calculationToggle === 'Pause') {
      $scope.stopCalculations();
      $scope.calculationToggle = 'Continue';
    } else {
      $scope.resumeCalculations();
      $scope.calculationToggle = 'Pause';
    }
  }

  $scope.backToForm = function() {
    $scope.step = 1;
    $scope.stopCalculations();
    $scope.cancelTimeWatch();
  }

  $scope.incrementAmountInSeconds = function() {
    switch($scope.incrementType) {
      case 'hours':
        return ($scope.incrementSize * 60) * 60;
        break;
      case 'minutes':
        return $scope.incrementSize * 60;
        break;
      case 'seconds':
        return $scope.incrementSize;
        break;
    }
  }

  $(document).on('keydown', function(event) {
    switch(event.keyCode) {
      case 67: // c
        $scope.$apply(function() {
          $scope.showConfig = !$scope.showConfig;
        });
        break;
      case 27: // esc
        $scope.$apply(function() {
          $scope.showConfig = false;
        });
        break;
      case 38: // up arrow
        event.preventDefault();
        $scope.$apply(function() {
          if ($scope.step === 2) {
            $scope.downtimeSeconds += $scope.incrementAmountInSeconds();
            $scope.downtime.setTime($scope.downtimeSeconds * 1000);
            $scope.calculateTimes();
          }
        });
        break;
      case 40: // down arrow
        event.preventDefault();
        $scope.$apply(function() {
          if ($scope.step === 2) {
            value = $scope.downtimeSeconds - $scope.incrementAmountInSeconds();

            if (value > 0) {
              $scope.downtimeSeconds = value;
            } else {
              $scope.downtimeSeconds = 0;
            }

            $scope.downtime.setTime($scope.downtimeSeconds * 1000);
            $scope.calculateTimes();
          }
        });
        break;
    }
  });
});
