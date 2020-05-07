import { Component, Injectable, Input, Pipe, PipeTransform } from '@angular/core';
import { CellContentTemplateComponent } from 'app/shared/table/cell-content-template/cell-content-template.component';
import { ConnStatus, Connector } from 'app/types/ChargingStation';

@Component({
  selector: 'app-charging-stations-connector-cell',
  template: `
    <!-- Connector ID -->
    <div class="d-flex justify-content-center">
      <div class="row mx-0 px-0 align-items-center detail-connector">
        <div appTooltip data-offset="0px, 8px"
            [title]="row | appChargingStationsFormatConnector:'text' | translate"
            class="charger-connector-container">
          <div [class]="row | appChargingStationsFormatConnector:'class'">
            {{row.connectorId | appConnectorId}}
          </div>
        </div>
        <!-- Connector Type -->
        <div class="d-inline-block" appTooltip data-offset="-15px, 8px" [title]="row.type | appConnectorType:'text' | translate">
          <div *ngIf="row.type && row.type !== null"
              class="charger-connector-container charger-connector-container-image d-flex align-items-center justify-content-center charger-connector-container-image-small charger-connector-type-background">
            <mat-icon [svgIcon]="row.type | appConnectorType:'icon'" class="d-flex"></mat-icon>
          </div>
        </div>
      </div>
    </div>
  `,
})
@Injectable()
export class ChargingStationsConnectorCellComponent extends CellContentTemplateComponent {
  @Input() public row!: Connector;
}

@Pipe({name: 'appChargingStationsFormatConnector'})
export class AppChargingStationsFormatConnectorPipe implements PipeTransform {
  public transform(connector: Connector, type: string): string {
    if (type === 'class') {
      return this.buildConnectorClasses(connector);
    }
    if (type === 'text') {
      return this.buildConnectorText(connector);
    }
    return '';
  }

  public buildConnectorClasses(connector: Connector): string {
    let classNames = 'charger-connector-background charger-connector-text ';
    switch (connector.status) {
      case ConnStatus.AVAILABLE: {
        classNames += 'charger-connector-available charger-connector-charging-available-text';
        break;
      }
      case ConnStatus.PREPARING: {
        classNames += 'charger-connector-preparing';
        break;
      }
      case ConnStatus.SUSPENDED_EVSE: {
        classNames += 'charger-connector-suspended-evse';
        break;
      }
      case ConnStatus.SUSPENDED_EV: {
        classNames += 'charger-connector-suspended-ev';
        break;
      }
      case ConnStatus.FINISHING: {
        classNames += 'charger-connector-finishing';
        break;
      }
      case ConnStatus.RESERVED: {
        classNames += 'charger-connector-reserved';
        break;
      }
      case ConnStatus.CHARGING:
      case ConnStatus.OCCUPIED: {
        // Check if charging
        if (connector.currentConsumption > 0) {
          classNames += 'charger-connector-charging-active charger-connector-background-spinner charger-connector-charging-active-text';
        } else {
          classNames += 'charger-connector-charging';
        }
        break;
      }
      case ConnStatus.UNAVAILABLE: {
        classNames += 'charger-connector-unavailable';
        break;
      }
      case ConnStatus.FAULTED: {
        classNames += 'charger-connector-faulted';
        break;
      }
      default: {
        classNames += 'charger-connector-charging-inactive';
        break;
      }
    }
    return classNames;
  }

  public buildConnectorText(connector: Connector): string {
    return `chargers.status_${connector.status.toLowerCase()}`;
  }
}
