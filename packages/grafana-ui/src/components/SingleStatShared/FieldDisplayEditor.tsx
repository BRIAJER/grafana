// Libraries
import React, { PureComponent, ChangeEvent } from 'react';

// Components
import { FormField, FormLabel, PanelOptionsGroup, StatsPicker, StatID } from '@grafana/ui';

// Types
import {
  FieldDisplayOptions,
  DEFAULT_FIELD_DISPLAY_VALUES_LIMIT,
  VAR_SERIES_NAME,
  VAR_FIELD_NAME,
  VAR_CALC,
  VAR_CELL_PREFIX,
} from '../../utils/fieldDisplay';
import { Field } from '../../types/data';
import Select, { SelectOptionItem } from '../Select/Select';
import { toNumberString, toIntegerOrUndefined } from '../../utils';

const showOptions: Array<SelectOptionItem<boolean>> = [
  {
    value: true,
    label: 'All Values',
    description: 'Each row in the response data',
  },
  {
    value: false,
    label: 'Calculation',
    description: 'Calculate a value based on the response',
  },
];

export interface Props {
  options: FieldDisplayOptions;
  onChange: (valueOptions: FieldDisplayOptions) => void;
  showPrefixSuffix: boolean;
  labelWidth?: number;
  children?: JSX.Element[];
}

export class FieldDisplayEditor extends PureComponent<Props> {
  onShowValuesChange = (item: SelectOptionItem<boolean>) => {
    const val = item.value === true;
    this.props.onChange({ ...this.props.options, values: val });
  };

  onStatsChange = (stats: string[]) => {
    this.props.onChange({ ...this.props.options, stats });
  };

  onTitleChange = (event: ChangeEvent<HTMLInputElement>) =>
    this.props.onChange({ ...this.props.options, title: event.target.value });

  onDefaultsChange = (value: Partial<Field>) => {
    this.props.onChange({ ...this.props.options, defaults: value });
  };

  onPrefixChange = (event: ChangeEvent<HTMLInputElement>) =>
    this.props.onChange({ ...this.props.options, prefix: event.target.value });

  onSuffixChange = (event: ChangeEvent<HTMLInputElement>) =>
    this.props.onChange({ ...this.props.options, suffix: event.target.value });

  onLimitChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.props.onChange({
      ...this.props.options,
      limit: toIntegerOrUndefined(event.target.value),
    });
  };

  render() {
    const { showPrefixSuffix, options, children } = this.props;
    const { title, stats, prefix, suffix, values, limit } = options;

    const titleTooltip = () => (
      <div>
        Template Variables:
        <br />
        {values ? '$' + VAR_CELL_PREFIX + '{N}' : '$' + VAR_CALC}
        <br />
        {'$' + VAR_SERIES_NAME}
        <br />
        {'$' + VAR_FIELD_NAME}
      </div>
    );

    const labelWidth = this.props.labelWidth || 5;

    return (
      <PanelOptionsGroup title="Display">
        <>
          <FormField
            label="Title"
            inputWidth={20}
            className="form-field--has-value"
            onChange={this.onTitleChange}
            value={title}
            tooltip={titleTooltip}
            placeholder="Auto"
            description="Title for each value/field, not the same as panel title."
          />
          <div className="form-field">
            <FormLabel width={labelWidth}>Show</FormLabel>
            <div className="form-field-desc">Calculate single value or show all?</div>
            <Select
              options={showOptions}
              width={20}
              value={values ? showOptions[0] : showOptions[1]}
              onChange={this.onShowValuesChange}
            />
          </div>
          {values ? (
            <FormField
              label="Limit"
              labelWidth={labelWidth}
              placeholder={`${DEFAULT_FIELD_DISPLAY_VALUES_LIMIT}`}
              onChange={this.onLimitChange}
              value={toNumberString(limit)}
              type="number"
            />
          ) : (
            <div className="form-field">
              <FormLabel width={labelWidth}>Calc</FormLabel>
              <div className="form-field-desc">Value calculation (mean, max, last, etc)</div>
              <StatsPicker
                width={12}
                placeholder="Choose Stat"
                defaultStat={StatID.mean}
                allowMultiple={false}
                stats={stats}
                onChange={this.onStatsChange}
              />
            </div>
          )}
          {showPrefixSuffix && (
            <>
              <FormField label="Prefix" labelWidth={labelWidth} onChange={this.onPrefixChange} value={prefix || ''} />
              <FormField label="Suffix" labelWidth={labelWidth} onChange={this.onSuffixChange} value={suffix || ''} />
            </>
          )}
          {children}
        </>
      </PanelOptionsGroup>
    );
  }
}
