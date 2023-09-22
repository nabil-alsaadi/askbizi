import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubSink } from 'ng-soapy-lib';
import { Alert, AlertType } from './alert.model';
import { AlertService } from './alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: 'alert.component.html',
  styleUrls: ['alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() id = 'default-alert';
  @Input() fade = true;
  @Input() soundAlert = '';

  alerts: Alert[] = [];

  subs = new SubSink();

  constructor(private router: Router, private alertService: AlertService) {}

  ngOnInit() {
    this.subs.sink = this.alertService.onAlert(this.id).subscribe((alert) => {
      if (!alert.message) {
        this.fade = true;
        alert.sound = true;
        this.alerts = this.alerts.filter((x) => x.keepAfterRouteChange);
        this.alerts.forEach((x) => delete x.keepAfterRouteChange);
        return;
      }

      // add alert to array
      if (!this.alerts.some((x) => x.type === alert.type)) {
        this.alerts.push(alert);
      } else {
        const sameAlert = this.alerts.find((x) => x.type === alert.type);

        const index = this.alerts.indexOf(sameAlert!);
        this.alerts[index] = alert;
      }

      //close the alert
      if (alert.autoClose) {
        setTimeout(() => this.removeAlert(alert), 3000);
      }
    });

    // clear alerts on location change
    // this.subs.sink = this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationStart) {
    //     this.alertService.clear(this.id);
    //   }
    // });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  removeAlert(alert: Alert) {
    // check if already removed to prevent error on auto close
    if (!this.alerts.includes(alert)) return;

    if (this.fade) {
      // fade out alert

      this.alerts.find((x) => x === alert)!.fade = true;

      // remove alert after faded out
      setTimeout(() => {
        this.alerts = this.alerts.filter((x) => x !== alert);
      }, 250);
    } else {
      // remove alert
      this.alerts = this.alerts.filter((x) => x !== alert);
    }
  }

  cssClass(alert: Alert) {
    if (!alert) return;

    const classes = ['alert', 'alert-dismissable'];

    const alertTypeClass = {
      [AlertType.Success]: 'alert-success',
      [AlertType.Error]: 'alert-danger',
      [AlertType.Info]: 'alert-info',
      [AlertType.Warning]: 'alert-warning'
    };
    if (alert.type) classes.push(alertTypeClass[alert.type]);

    if (alert.fade) {
      classes.push('fade');
    }
    if (alert.message) classes.push('fade-div');

    return classes.join(' ');
  }
}
