import React from 'react';
import fs from 'fs';
import ElasticsearchProvider from '../lib/providers/elasticsearch-provider';

export default class Main extends React.Component {

  constructor(props) {
    super(props);
    this.provider = new ElasticsearchProvider();
    this.state = {};
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
    // console.log(this.state);
  }

  handleSubmit(event) {
    function mapNewLineToArray(rawIdentifiers) {
      return rawIdentifiers
              .replace(/^\s+|\s+$/g, '')
              .split(/\s+/);
    }

    try {

      let ids = [];

      var filePath = document.getElementById('ids-file').files.length > 0
        ? document.getElementById('ids-file').files[0].path : null;
      if (filePath)
      {
        var raw = fs.readFileSync(filePath, "utf8");
        ids = mapNewLineToArray(raw);
      } else {
        ids = mapNewLineToArray(this.state.idsText);
      }

      this.provider.bulkDelete(
        this.state.clusterUrl,
        this.state.indexName,
        this.state.typeName,
        ids
      )
      .then((result) => {
        alert('success');
      })
      .catch((error) => {
        console.log(error);
        alert('failed');
      })
    }
    finally {
      event.preventDefault();
    }
  }

  render() {
    return (
      <div className="container">
            <h1>Bulk Delete</h1>

            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="cluster">Cluster Url (with cred)</label>
                    <input name="clusterUrl" type="text" id="clusterUrl" className="form-control"
                    value={this.state.clusterUrl} onChange={this.handleInputChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="index-name">Index</label>
                    <input name="indexName" type="text" id="index-name" className="form-control"
                    value={this.state.indexName} onChange={this.handleInputChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="type-name">Type</label>
                    <input name="typeName" type="text" id="type-name" className="form-control"
                    value={this.state.typeName} onChange={this.handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="ids-file">Identifiers (newline delimeted)</label>
                  <input name="idsFile" type="file" id="ids-file" className="form-control-file" />
                </div>
                <div className="form-group d-none">
                    <label htmlFor="identifiers">Identifiers (newline delimeted)</label>
                    <textarea name="idsText" id="identifiers" className="form-control" rows="10"
                    value={this.state.idsText} onChange={this.handleInputChange}></textarea>
                </div>
                <input type="submit" className="btn btn-primary" value="Submit" />
            </form>
        </div>
    );
  }
}
