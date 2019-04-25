import template from 'lodash/template';
import { repairPath } from '../../utils/fileUtils';
import { path } from '../../utils/electronUtils';
import { checkFileExists } from '../utils';
import { format } from '../../export/utils';

const templateContent = `
import React from 'react';
import PropTypes from 'prop-types';

const rootStyle = {
    padding: '2em',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
};

/*
  <%= componentName %> component generated by Webcodesk 
 */
class <%= componentName %> extends React.Component {
  constructor (props) {
    super(props);
  }
  
  handleChange = (e) => {
    const { onChange } = this.props;
    onChange(e.target.value);
  };

  render () {
    const { value } = this.props;
    return (
      <div style={rootStyle}>
        <input type="text" onChange={this.handleChange} value={value} />
      </div>
    );
  }
}

<%= componentName %>.propTypes = {
  // any string
  value: PropTypes.string,
  // send value on input change
  onChange: PropTypes.func,
};

<%= componentName %>.defaultProps = {
  string: '',
  onChange: () => {
    // is not set
  },
};

export default <%= componentName %>;
`;

export async function createFiles (componentName, dirName, destDirPath, fileExtension) {
  const fileObjects = [];
  let fileExists;
  const componentFilePath = repairPath(path().join(destDirPath, dirName, `${componentName}${fileExtension}`));
  fileExists = await checkFileExists(componentFilePath);
  if (fileExists) {
    throw Error(`The file with the "${componentName}${fileExtension}" name already exists.`);
  }
  fileObjects.push({
    filePath: componentFilePath,
    fileData: format(template(templateContent)({
      componentName
    }))
  });
  return fileObjects;
}