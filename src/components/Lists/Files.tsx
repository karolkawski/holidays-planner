import {IFile} from '@/src/interfaces/IFile';

function Files({files}: {files: IFile | null}) {
  if (!files) {
    return <div className="w-full mt-5flex justify-center">No files available</div>;
  }

  return (
    <>
      <h3>Files:</h3>
      <div className="w-full mt-5 flex justify-between">
        <>
          <h2>Offers:</h2>
          {Array.isArray(files.offers) ? (
            <ul>
              {files.offers.map((file, index) => (
                <li key={index}>{file}</li>
              ))}
            </ul>
          ) : (
            <p>No files available.</p>
          )}
        </>
        <>
          <h2>Screenshots:</h2>
          {Array.isArray(files.screenshots) && files.screenshots.length > 0 ? (
            <ul>
              {files.screenshots.map((file, index) => (
                <li key={index}>
                  <a href={`output/screenshots/${file}`} target="_blank" rel="noopener noreferrer">
                    {file}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No files available.</p>
          )}
        </>
      </div>
    </>
  );
}

export default Files;
