/* Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import * as React from 'react';
import { Component } from 'react';
import * as Select from 'react-select';
import { WebProject } from '../../../../server/api/projects/interfaces';

interface Props {
  createProject?: (data: Partial<WebProject>) => null;
  groups: any[];
}

interface State {
  ownerGroup: Select.Option;
}

export default class ProjectOnboardingForm extends Component<Props, State> {

  state = {
    ownerGroup: null,
  };

  componentDidMount() {
    $('[data-toggle="tooltip"]').tooltip({placement: 'bottom', container: 'body'});
  }

  handleSubmit(e) {
    e.preventDefault();
    const { createProject } = this.props;

    const fields = e.target.elements;
    createProject({
      title: fields.title.value,
      version: fields.version.value,
      description: fields.description.value,
      plannedRelease: fields.plannedRelease.value,
      contacts: {
        legal: [
          fields.legalContact.value,
        ],
      },
      acl: {
        [fields.ownerGroup.value]: 'owner',
      },
      metadata: {
        open_sourcing: fields.openSourcing.value === 'true',
      },
    });
  }

  mapGroups = () => {
    const { groups } = this.props;

    return groups.map((group) => {
      const firstColon = group.indexOf(':');
      if (firstColon === -1) {
        return {
          value: group,
          label: group,
        };
      }

      // if colon-prefixed, assume it's a type of group (e.g., ldap, posix)
      const type = group.substring(0, firstColon);
      const name = group.substring(firstColon + 1);
      return {
        value: group,
        label: `${name} (${type})`,
      };
    });
  }

  render() {
    const sub = this.handleSubmit.bind(this);

    return (
      <div className="container">
        <form id="onboarding-form" onSubmit={sub}>

          <div className="form-group row">
            <label htmlFor="title" className="col-md-3 col-form-label">Title</label>
            <div className="col-md-7">
              <input type="text" id="title" className="form-control" required />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="version" className="col-md-3 col-form-label">Version</label>
            <div className="col-md-7">
              <input type="text" id="version" className="form-control" required />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="description" className="col-md-3 col-form-label">What does it do?</label>
            <div className="col-md-7">
              <textarea id="description" className="form-control" required />
            </div>
          </div>

          <div className="form-group row">
            <label className="col-md-3 col-form-label">Are you open sourcing any internal code?</label>
            <div className="col-md-7">
              <div className="form-check form-check-inline">
                <label className="form-check-label">
                  <input type="radio" name="openSourcing" value="true" required /> Yes
                </label>
              </div>
              <div className="form-check form-check-inline">
                <label className="form-check-label">
                  <input type="radio" name="openSourcing" value="false" required /> No
                </label>
              </div>
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="legalContact" className="col-md-3 col-form-label">
              Who is your legal contact?
            </label>
            <div className="col-md-7">
              <input type="text" id="legalContact" className="form-control" required />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="plannedRelease" className="col-md-3 col-form-label">
              Planned release date
            </label>
            <div className="col-md-7">
              <input type="date" id="plannedRelease" className="form-control" placeholder="YYYY-MM-DD" required />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="ownerGroup" className="col-md-3 col-form-label">
              Project owner (group)
            </label>
            <div className="col-md-7" id="ownerGroup-container">
              <Select
                name="ownerGroup"
                options={this.mapGroups()}
                value={this.state.ownerGroup}
                onChange={(ownerGroup) => this.setState({ownerGroup: ownerGroup as Select.Option})}
              />
            </div>
          </div>

          <div className="form-group row">
            <div className="col-md-7 offset-md-3">
              <button type="submit" className="btn btn-primary btn-lg">Next</button>
            </div>
          </div>

        </form>
      </div>
    );
  }
}
